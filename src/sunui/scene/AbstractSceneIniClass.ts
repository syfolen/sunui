
module sunui {

    /**
     * 场景初始化抽象入口类
     */
    export abstract class AbstractSceneIniClass extends suncore.AbstractTask {

        constructor() {
            super();
            puremvc.Facade.getInstance().registerObserver(NotifyKey.ENTER_SCENE, this.$onEnterScene, this, true);
        }

        run(): boolean {
            return true;
        }

        /**
         * 接收到进入场景通知
         */
        protected $onEnterScene(): void {

        }
    }
}