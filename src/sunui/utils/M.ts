
module sunui {
    /**
     * 数据中心
     */
    export namespace M {
        /**
         * 视图层
         */
        export let viewLayer: ViewLayer;

        /**
         * 场景层
         */
        export let sceneLayer: SceneLayer;

        /**
         * 模版集合
         */
        export const templets: { [url: string]: Templet } = {};

        /**
         * 资源引用计数集合
         */
        export const references: { [url: string]: number } = {};

        /**
         * 缓动Service
         */
        export let tweenService: TweenService = null;

        /**
         * 资源加载管理Service
         */
        export let resourceService: ResourceService = null;
    }
}