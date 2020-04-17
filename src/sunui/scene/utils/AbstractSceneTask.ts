
module sunui {
    /**
     * 场景入口抽象类
     * export
     */
    export abstract class AbstractSceneTask extends suncore.AbstractTask {
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
         * @info: 当前场景信息
         * @data: 当前场景构建时的传入数据
         * export
         */
        constructor(info: ISceneInfo, data?: any) {
            super();
            this.$info = info;
            this.$data = data;
        }
    }
}