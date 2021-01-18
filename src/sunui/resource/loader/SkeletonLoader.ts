
module sunui {
    /**
     * 龙骨加载器
     */
    export class SkeletonLoader extends AssetLoader {

        /**
         * 预加载龙骨资源
         */
        protected $doLoad(): void {
            this.$loadAssets([this.$url, suncom.Common.replacePathExtension(this.$url, "png")]);
        }

        /**
         * 所有资源均己加载成功
         */
        protected $onAssetsLoaded(ok: boolean): void {
            if (ok === true) {
                Resource.lock(this.$url);
                new Laya.Skeleton().load(this.$url, Laya.Handler.create(this, this.$onSkeletonCreated));
            }
            else {
                this.$onComplete(false);
            }
        }

        /**
         * 龙骨创建完成
         */
        private $onSkeletonCreated(skeleton: Laya.Skeleton): void {
            skeleton.destroy();
            if (this.destroyed === false) {
                this.$onComplete(true);
            }
            Resource.unlock(this.$url);
        }
    }
}