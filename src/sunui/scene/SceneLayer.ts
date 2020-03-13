
module sunui {
    /**
     * 场景层
     */
    export class SceneLayer extends puremvc.Notifier {
        /**
         * 是否己就绪，为false时不会响应场景跳转请求
         */
        private $ready: boolean = true;

        /**
         * 当前场景名字
         */
        private $sceneName: number = 0;

        /**
         * ui场景对象
         */
        private $uiScene: Laya.Scene = null;

        /**
         * 当前场景对象
         */
        private $d3Scene: Laya.Scene3D = null;

        constructor() {
            super();
            // 场景管理器应该对此消息优先响应
            this.facade.registerObserver(NotifyKey.ENTER_SCENE, this.$onEnterScene, this, false, 5);
        }

        /**
         * 进入指定场景
         * @data: 参数对象
         * 说明：场景参数在进入下一个场景时会自动被保存，在返回场景时会被重新传入，在返回上一个场景时被丢弃
         */
        private $enterScene(name: number, data: any): void {
            // 获取场景配置信息
            const info: ISceneInfo = SceneManager.getConfigByName(name);
            // 初始化场景（场景初始化应当被无限延后，因为上一个场景反初始化方法中可能会增加一些卸载资源的任务）
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$beforeLoadScene, [info, data]));
            // 加载当前场景（场景加载应当被无限延后，因为初始化方法中可能会增加一些加载资源的任务）
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$loadScene, [info, data]));
        }

        /**
         * 在初始化场景之前，需要先设置当前场景的名字，并执行iniCls
         */
        private $beforeLoadScene(info: ISceneInfo, data: any): void {
            this.$sceneName = info.name;
            this.facade.sendNotification(NotifyKey.BEFORE_LOAD_SCENE);

            const task: suncore.ITask = data === void 0 ? new info.iniCls() : new info.iniCls(data);
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, 0, task);
        }

        /**
         * 加载场景
         */
        private $loadScene(info: ISceneInfo, data: any): void {
            this.facade.sendNotification(NotifyKey.LOAD_SCENE, [info, data]);
        }

        /**
         * 成功进入场景
         */
        private $onEnterScene(uiScene: Laya.Scene, d3Scene: Laya.Scene3D): void {
            this.$ready = true;
            this.$uiScene = uiScene;
            this.$d3Scene = d3Scene;
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
        }

        /**
         * 退出当前场景
         * 说明：不会将场景从历史中移除
         */
        private $exitScene(): void {
            // 派发退出场景事件
            this.facade.sendNotification(NotifyKey.EXIT_SCENE, this.$sceneName);
            // 暂停场景时间轴
            this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);

            // 反初始化场景（反场景初始化应当被无限延后，因为需要等待Loading界面的展示）
            const info: ISceneInfo = SceneManager.getConfigByName(this.$sceneName);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$beforeExitScene, [info]));
        }

        /**
         * 退出场景之前
         */
        private $beforeExitScene(info: ISceneInfo): void {
            // 执行反初始化任务
            info.uniCls && suncore.System.addTask(suncore.ModuleEnum.SYSTEM, 0, new info.uniCls());
            // 退出成功（此时场景并未销毁）
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, 0, new suncore.SimpleTask(
                suncom.Handler.create(this, this.$onExitScene, [info])
            ));
        }

        /**
         * 退出场景
         */
        private $onExitScene(info: ISceneInfo): void {
            this.facade.sendNotification(NotifyKey.UNLOAD_SCENE, info);
            this.$sceneName = 0;
        }

        /**
         * 进入新场景，并将当前场景压入历史
         * @data: 参数对象，保存在此对象中的数据的生命周期与场景历史的生命周期一致，当场景存在于当前或存在于历史时，数据就不会被销毁
         */
        enterScene(name: number, data?: any): boolean {
            // 未就绪时不允许跳转场景
            if (this.$ready === false) {
                return false;
            }
            this.$ready = false;
            // 退出当前场景
            this.$sceneName != 0 && this.$exitScene();
            // 进入新场景
            this.$enterScene(name, data);
            // 将新场景压入历史
            SceneHeap.addHistory(name, data);
            // 执行成功时返回true，此参数在replaceScene中会用到
            return true;
        }

        /**
         * 退出当前场景，并返回历史
         */
        exitScene(): void {
            // 未就绪时不允许跳转场景
            if (this.$ready === false) {
                return;
            }
            this.$ready = false;
            // 退出当前场景
            this.$sceneName != 0 && this.$exitScene();
            // 移除历史
            SceneHeap.removeHistory(this.$sceneName);
            // 获取历史场景
            const info: ISceneHeapInfo = SceneHeap.pop();
            // 进入历史场景
            info !== null && this.$enterScene(info.name, info.data);
        }

        /**
         * 替换当前场景
         * @data: 参数说明请参考enterScene方法的注释
         * 说明：被替换的场景不会进入历史
         */
        replaceScene(name: number, data?: any): void {
            // 获取当前场景的历史
            const info: ISceneHeapInfo = SceneHeap.pop();
            // 进入新场景
            if (this.enterScene(name, data) === true) {
                // 进入新场景
                info !== null && SceneHeap.removeHistory(info.name);
            }
        }

        /**
         * 删除历史
         */
        deleteHistories(deleteCount: number): void {
            SceneHeap.deleteHistories(deleteCount);
        }

        /**
         * 获取ui场景对象
         */
        get uiScene(): any {
            return this.$uiScene;
        }

        /**
         * 获取3d场景对象
         */
        get d3Scene(): any {
            return this.$d3Scene;
        }

        /**
         * 获取场景名字
         */
        get sceneName(): number {
            return this.$ready === false ? 0 : this.$sceneName;
        }
    }
}