
module sunui {
    /**
     * 资源预加载信息
     */
    export interface IAssetInfo {
        /**
         * 资源地址
         */
        url: string;

        /**
         * 加载器对象
         */
        loader: AssetSafetyLoader;

        /**
         * 回调方法
         */
        method: (data: any, url: string) => void;

        /**
         * 回调对象
         */
        caller: Object;
    }
}