
module sunui {
    /**
     * 场景初始化抽象入口类
     * export
     */
    export abstract class AbstractSceneIniClass extends suncore.AbstractTask {

        /**
         * 可为构造函数指定参数来实现场景间的数据传递
         */
        constructor() {
            super();
            this.facade.registerObserver(NotifyKey.ENTER_SCENE, this.$onEnterScene, this, true);
        }

        /**
         * 初始化执行函数，场景资源建议在此方法中加载
         * export
         */
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