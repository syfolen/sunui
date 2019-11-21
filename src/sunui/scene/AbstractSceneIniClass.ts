
module sunui {

    /**
     * 场景初始化抽象入口类
     * export
     */
    export abstract class AbstractSceneIniClass extends suncore.AbstractTask {

        constructor() {
            super();
            puremvc.Facade.getInstance().registerObserver(NotifyKey.ENTER_SCENE, this.$onEnterScene, this, true);
        }
        
        /**
         * export
         */
        run(): boolean {
            return true;
        }

        /**
         * 接收到进入场景通知
         * export
         */
        protected $onEnterScene(): void {

        }
    }
}