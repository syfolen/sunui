
module sunui {
    /**
     * 龙骨加载器
     */
    export class SkeletonLoader extends UrlLoader {
        /**
         * 模板对象
         */
        private $templet: Laya.Templet = null;

        /**
         * 开始加载
         */
        protected $doLoad(): void {
            Laya.loader.load(Resource.getLoadList(this.$url), Laya.Handler.create(this, this.$onUrlLoad));
        }

        /**
         * 结束加载
         */
        private $onUrlLoad(ok: boolean): void {
            if (this.$handler === null) {
                return;
            }
            if (this.$templet === null) {
                this.$templet = new Laya.Templet();
                this.$templet.on(Laya.Event.ERROR, this, this.$onLoad, [false]);
                this.$templet.on(Laya.Event.COMPLETE, this, this.$onLoad, [true]);
                this.$templet.loadAni(this.$url);
            }
            else {
                this.$onLoad(true);
            }
        }

        /**
         * 销毁加载器
         */
        destroy(): void {
            if (this.$templet !== null) {
                this.$templet.off(Laya.Event.ERROR, this, this.$onLoad);
                this.$templet.off(Laya.Event.COMPLETE, this, this.$onLoad);
                this.$templet.destroy();
                this.$templet = null;
            }
            super.destroy();
        }

        /**
         * 创建对象
         */
        create(): Laya.Texture2D | any {
            return this.$templet.buildArmature(2) || null;
        }
    }
}