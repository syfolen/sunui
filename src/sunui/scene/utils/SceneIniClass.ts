
module sunui {
    /**
     * 场景初始化入口类
     * export
     */
    export abstract class SceneIniClass extends AbstractSceneTask {

        /**
         * export
         */
        constructor(info: ISceneInfo, data?: any) {
            super(info, data);
            this.facade.registerObserver(NotifyKey.ENTER_SCENE, this.$onEnterScene, this, true, suncom.EventPriorityEnum.EGL);
        }

        /**
         * 进入场景回调，场景数据建议在此方法中初始化
         * 说明：
         * 1. 此方法会后于run执行
         * export
         */
        protected $onEnterScene(): void {

        }
    }
}