
module sunui {
    /**
     * 场景反初始化入口类
     * export
     */
    export abstract class SceneUniClass extends AbstractSceneTask {

        /**
         * export
         */
        constructor(info: ISceneInfo, data?: any) {
            super(info, data);
            this.facade.registerObserver(NotifyKey.LEAVE_SCENE, this.$onLeaveScene, this, true, suncom.EventPriorityEnum.EGL);
        }

        /**
         * 离开场景回调，场景数据建议在此方法中反初始化，场景将在此方法执行完毕后销毁
         * 说明：
         * 1. 此方法会先于run执行
         * export
         */
        protected $onLeaveScene(): void {

        }
    }
}