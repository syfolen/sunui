
module sunui {
    /**
     * URL加载器
     */
    export class UrlLoader extends AssetLoader {

        /**
         * 开始加载
         */
        protected $doLoad(): void {
            this.$loadAssets([this.$url]);
        }

        /**
         * 所有资源均己加载成功
         */
        protected $onAssetsLoaded(ok: boolean): void {
            this.$onComplete(ok, Laya.Loader.getRes(this.$url));
        }
    }
}