
module sunui {
    /**
     * 龙骨加载器
     */
    export class SkeletonLoader extends AssetLoader {
        /**
         * 龙骨动画模式
         */
        private $aniMode: number = 0;

        constructor(url: string, handler: suncom.IHandler, aniMode: number = 0) {
            super(url, handler);
            this.$aniMode = aniMode;
        }

        /**
         * 预加载龙骨资源
         */
        protected $doLoad(): void {
            this.$loadAssets(Resource.getLoadList(this.$url));
        }

        /**
         * 所有资源均己加载成功
         */
        protected $onAssetsLoaded(ok: boolean): void {
            if (ok === true) {
                const skeleton: Laya.Skeleton = new Laya.Skeleton(null, this.$aniMode);
                skeleton.load(this.$url, Laya.Handler.create(this, this.$onSkeletonCreated));
            }
            else {
                this.$onComplete(false);
            }
        }

        /**
         * 龙骨创建完成
         */
        private $onSkeletonCreated(skeleton: Laya.Skeleton): void {
            if (this.destroyed === true) {
                skeleton.destroy();
            }
            else {
                this.$onComplete(true, skeleton);
            }
        }
    }
}