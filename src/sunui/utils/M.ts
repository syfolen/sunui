
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
         * 资源加载速度
         */
        export let downloadSpeed: ResourceDownloadSpeedEnum = ResourceDownloadSpeedEnum.NONE;

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

        /**
         * 下载限制器队列
         */
        export const downloadLimiters: UrlDownloadLimiter[] = [];
    }
}