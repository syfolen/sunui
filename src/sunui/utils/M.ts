
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
         * 全局资源缓存
         */
        export const cacheMap: { [url: string]: any } = {};

        /**
         * 模版集合
         */
        export const templets: { [url: string]: Templet } = {};

        /**
         * 资源引用计数集合
         */
        export const references: { [url: string]: number } = {};
    }
}