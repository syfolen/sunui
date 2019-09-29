
module sunui {

    /**
     * 场景层
     */
    export class SceneLayer {

        /**
         * 是否己就绪，为false时不会响应场景跳转请求
         */
        private $ready: boolean = true;

        /**
         * ui场景对象
         */
        private $uiScene: Laya.Scene = null;

        /**
         * 当前场景对象
         */
        private $d3Scene: Laya.Scene3D;

        /**
         * 当前场景名字
         */
        private $sceneName: number = 0;

        constructor() {
            // 场景管理器应该对此消息优先响应
            puremvc.Facade.getInstance().registerObserver(NotifyKey.ENTER_SCENE, this.$onEnterScene, this, false, 5);
        }

        /**
         * 进入指定场景
         */
        private $enterScene(name: number, args: any): void {
            let str = null;
            if (typeof args === "object") {
                try {
                    str = JSON.stringify(args);
                }
                catch (error) {
                    str = args;
                    suncom.Logger.warn(`参数无法转化为JSON`);
                }
            }
            else {
                str = args;
            }
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                suncom.Logger.log(`SceneLayer=>$enterScene, name:${name}, args:${str}`);
            }
            const info: ISceneInfo = SceneManager.getConfigByName(name);
            // 初始化场景（场景初始化应当被无限延后，因为上一个场景反初始化方法中可能会增加一些卸载资源的任务）
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$beforeLoadScene, [info, args]));
            // 加载当前场景（场景加载应当被无限延后，因为初始化方法中可能会增加一些加载资源的任务）
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$loadScene, [info]));
        }

        /**
         * 在初始化场景之前，需要先设置当前场景的名字
         */
        private $beforeLoadScene(info: ISceneInfo, args: any): void {
            this.$sceneName = info.name;
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                suncom.Logger.log(`SceneLayer=>$beforeInitScene, name:${info.name}`);
            }
            info.iniCls && new info.iniCls(args).run();
        }

        /**
         * 加载场景
         */
        private $loadScene(info: ISceneInfo): void {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                suncom.Logger.log(`SceneLayer=>$loadScene, name:${info.name}`);
            }
            puremvc.Facade.getInstance().sendNotification(NotifyKey.LOAD_SCENE, info);
        }

        /**
         * 成功进入场景
         */
        private $onEnterScene(uiScene: Laya.Scene, d3Scene: Laya.Scene3D): void {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                suncom.Logger.log(`SceneLayer=>$onSceneEnter, name:${this.$sceneName}`);
            }
            this.$ready = true;
            this.$uiScene = uiScene;
            this.$d3Scene = d3Scene;
            suncore.System.timeStamp.resume();
        }

        /**
         * 退出当前场景
         * 说明：不会将场景从历史中移除
         */
        private $exitScene(): void {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                suncom.Logger.log(`SceneLayer=>$exitScene, sceneName:${this.$sceneName}`);
            }
            // 暂停场景时间轴
            suncore.System.timeStamp.stop();

            // 派发退出场景事件
            const info: ISceneInfo = SceneManager.getConfigByName(this.$sceneName);
            puremvc.Facade.getInstance().sendNotification(NotifyKey.EXIT_SCENE, this.$sceneName);

            // 执行反初始化任务
            info.uniCls && suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new info.uniCls());
            // 退出成功（此时场景并未销毁）
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new suncore.SimpleTask(
                suncom.Handler.create(this, this.$onExitScene)
            ));
        }

        private $onExitScene(): void {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                suncom.Logger.log(`SceneLayer=>$onExitScene, name:${this.$sceneName}`);
            }
            const info: ISceneInfo = SceneManager.getConfigByName(this.$sceneName);
            puremvc.Facade.getInstance().sendNotification(NotifyKey.UNLOAD_SCENE, info);
            this.$sceneName = 0;
        }

        /**
         * 进入新场景，并将当前场景压入历史
         */
        enterScene(name: number, args?: any): boolean {
            // 未就绪时不允许跳转场景
            if (this.$ready == false) {
                return false;
            }
            this.$ready = false;
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                suncom.Logger.log(`SceneLayer=>enterScene, name:${name}`);
            }
            // 退出当前场景
            this.$sceneName != 0 && this.$exitScene();
            // 进入新场景
            this.$enterScene(name, args);
            // 将新场景压入历史
            SceneHeap.addHistory(name, args);
            // 执行成功时返回true，此参数在replaceScene中会用到
            return true;
        }

        /**
         * 退出当前场景，并返回历史
         */
        exitScene(): void {
            // 未就绪时不允许跳转场景
            if (this.$ready == false) {
                return;
            }
            this.$ready = false;
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                suncom.Logger.log(`SceneLayer=>exitScene, name:${this.$sceneName}`);
            }
            // 退出当前场景
            this.$sceneName != 0 && this.$exitScene();
            // 移除历史
            SceneHeap.removeHistory(this.$sceneName);
            // 获取历史场景
            const info: ISceneHeapInfo = SceneHeap.pop();
            // 进入历史场景
            info !== null && this.$enterScene(info.name, info.args);
        }

        /**
         * 替换当前场景
         * 说明：被替换的场景不会进入历史
         */
        replaceScene(name: number, args?: any): void {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                suncom.Logger.log(`SceneLayer=>replaceScene, name:${name}`);
            }
            // 获取当前场景的历史
            const info: ISceneHeapInfo = SceneHeap.pop();
            // 进入新场景
            if (this.enterScene(name, args) == false) {
                return;
            }
            // 进入新场景
            info !== null && SceneHeap.removeHistory(info.name);
        }

        /**
         * 判断当前场景是否为指定类型的场景
         */
        isCurrentSceneMatch(sceneClass: any): boolean {
            if (this.$uiScene != null && this.$uiScene instanceof sceneClass) {
                return true;
            }
            return false;
        }

        get uiScene(): any {
            return this.$uiScene;
        }

        get d3Scene(): any {
            return this.$d3Scene;
        }

        get sceneName(): number {
            return this.$sceneName;
        }
    }
}