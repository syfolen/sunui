
module sunui {
    /**
     * 数据中心
     */
    export namespace M {
        /**
         * 资源模版集合
         */
        export let templets: { [url: string]: Templet } = {};

        /**
         * 视图层
         */
        export let viewLayer: ViewLayer;

        /**
         * 场景层
         */
        export let sceneLayer: SceneLayer;
    }
}