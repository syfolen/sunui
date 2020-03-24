
module sunui {
    /**
     * 场景初始化抽象入口类
     * export
     */
    export abstract class AbstractSceneIniClass extends suncore.AbstractTask {
        /**
         * 场景配置信息
         * export
         */
        protected $info: ISceneInfo = null;

        /**
         * 场景跳转参数
         * export
         */
        protected $data: any;

        /**
         * export
         */
        constructor(info: ISceneInfo, data?: any) {
            super();
            this.$info = info;
            this.$data = data;
            this.facade.registerObserver(NotifyKey.ENTER_SCENE, this.$onEnterScene, this, true);
        }

        run(): boolean {
            return true;
        }

        /**
         * 进入场景回调，场景元素建议在此方法中初始化
         * export
         */
        protected $onEnterScene(): void {

        }
    }
}