
module sunui {
    /**
     * fairygui资源加载器
     */
    export class FGuiLoader extends AssetLoader {

        /**
         * 预加载龙骨资源
         */
        protected $doLoad(): void {
            this.$loadAssets([this.$url]);
        }

        /**
         * 所有资源均己加载成功
         */
        protected $onAssetsLoaded(ok: boolean): void {
            this.$onComplete(ok);
        }
    }
}