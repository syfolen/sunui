
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
        private $scene2d: Laya.Scene | fairygui.GComponent = null;

        /**
         * 当前场景对象
         */
        private $scene3d: Laya.Scene3D = null;

        /**
         * 当前场景数据
         */
        private $data: any = null;

        constructor() {
            super();
            // 场景管理器应该对此消息优先响应
            this.facade.registerObserver(NotifyKey.ENTER_SCENE, this.$onEnterScene, this, false, suncom.EventPriorityEnum.OSL);
        }

        /**
         * 进入指定场景
         * @data: 参数对象
         * 说明：场景参数在进入下一个场景时会自动被保存，在返回场景时会被重新传入，在返回上一个场景时被丢弃
         */
        private $enterScene(name: number, data: any): void {
            // 获取场景配置信息
            const info: ISceneInfo = SceneManager.getConfigByName(name);
            // 初始化场景（应当被无限延后，因为上一个场景反初始化方法中可能会增加一些卸载资源的任务）
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, this, this.$beforeLoadScene, [info, data]);
            // 加载当前场景（应当被无限延后，因为初始化方法中可能会增加一些加载资源的任务）
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, this, this.$loadScene, [info, data]);
        }

        /**
         * 在初始化场景之前，需要先设置当前场景的名字，并执行iniCls
         */
        private $beforeLoadScene(info: ISceneInfo, data: any): void {
            this.$data = data;
            this.$sceneName = info.name;
            // 此事件主要用于展示LoadingView
            this.facade.sendNotification(NotifyKey.BEFORE_LOAD_SCENE);
            info.iniCls && suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new info.iniCls(info, data));
        }

        /**
         * 加载场景
         */
        private $loadScene(info: ISceneInfo, data: any): void {
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            info.scene3d = info.scene3d || null;
            this.facade.sendNotification(NotifyKey.LOAD_SCENE, [info, data]);
        }

        /**
         * 成功进入场景
         */
        private $onEnterScene(scene2d: Laya.Scene, scene3d: Laya.Scene3D): void {
            this.$ready = true;
            this.$scene2d = scene2d || null;
            this.$scene3d = scene3d || null;
            this.facade.sendNotification(NotifyKey.SCENE_IS_READY, true);
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
        }

        /**
         * 退出当前场景
         * 说明：不会将场景从历史中移除
         */
        private $exitScene(): void {
            this.facade.sendNotification(NotifyKey.EXIT_SCENE, this.$sceneName);
            this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            // 离开当前场景（应当被无限延后，因为需要等待Loading界面的展示）
            const info: ISceneInfo = SceneManager.getConfigByName(this.$sceneName);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, this, this.$onLeaveScene, [info]);
        }

        /**
         * 离开当前场景
         */
        private $onLeaveScene(info: ISceneInfo): void {
            info.uniCls && suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new info.uniCls(info, this.$data));
            this.facade.sendNotification(NotifyKey.BEFORE_LEAVE_SCENE);
            this.facade.sendNotification(NotifyKey.LEAVE_SCENE);
            this.facade.sendNotification(NotifyKey.UNLOAD_SCENE, [this.$scene2d, this.$scene3d]);
            // info.scene2d !== null && RES.clearResByUrl(info.scene2d);
            // 当前场景名字应当于uniCls.run执行完毕之后再置空
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new suncore.SimpleTask(this, this.$onExitScene));
        }

        /**
         * 退出场景
         */
        private $onExitScene(): void {
            this.$sceneName = 0;
        }

        /**
         * 进入新场景，并将当前场景压入历史
         * @data: 参数对象，保存在此对象中的数据的生命周期与场景历史的生命周期一致，当场景存在于当前或存在于历史时，数据就不会被销毁
         * @return: 执行成功时返回true，此参数在replaceScene中会用到
         */
        enterScene(name: number, data?: any): boolean {
            if (this.$ready === false) {
                return false;
            }
            this.$ready = false;
            this.facade.sendNotification(NotifyKey.SCENE_IS_READY, false);

            this.$sceneName != 0 && this.$exitScene();

            this.$enterScene(name, data);
            SceneHeap.addHistory(name, data);
            return true;
        }

        /**
         * 退出当前场景，并返回历史
         */
        exitScene(): void {
            if (this.$ready === false) {
                return;
            }
            this.$ready = false;
            this.facade.sendNotification(NotifyKey.SCENE_IS_READY, false);

            this.$sceneName != 0 && this.$exitScene();
            SceneHeap.removeHistory(this.$sceneName);

            const info: ISceneHeapInfo = SceneHeap.getLastestSceneInfo();
            info !== null && this.$enterScene(info.name, info.data);
        }

        /**
         * 替换当前场景
         * @data: 参数说明请参考enterScene方法的注释
         * 说明：被替换的场景不会进入历史
         */
        replaceScene(name: number, data?: any): void {
            const info: ISceneHeapInfo = SceneHeap.getLastestSceneInfo();
            if (this.enterScene(name, data) === true) {
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
         * 场景是否己就绪
         */
        get ready(): boolean {
            return this.$ready;
        }

        /**
         * 获取ui场景对象
         */
        get scene2d(): any {
            return this.$scene2d;
        }

        /**
         * 获取3d场景对象
         */
        get scene3d(): any {
            return this.$scene3d;
        }

        /**
         * 获取场景名字
         */
        get sceneName(): number {
            return this.$sceneName;
        }
    }
}