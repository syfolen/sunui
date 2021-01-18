
module sunui {
    /**
     * 资源加载器
     */
    export abstract class AssetLoader extends puremvc.Notifier {
        /**
         * 加载回调
         */
        private $complete: suncom.IHandler = null;

        /**
         * 加载网址
         */
        protected $url: string = null;

        /**
         * 加载器列表
         */
        protected $loaders: UrlSafetyLoader[] = [];

        /**
         * 己完成的加载器数量
         */
        protected $doneCount: number = 0;

        constructor(url: string, complete: suncom.IHandler) {
            super();
            this.$url = url;
            this.$complete = complete;
            RES.lock(this.$url);
        }

        /**
         * 销毁加载器
         */
        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();
            for (let i: number = 0; i < this.$loaders.length; i++) {
                this.$loaders[i].destroy();
            }
            RES.unlock(this.$url);
        }

        /**
         * 开始加载
         */
        load(): void {
            if (this.$destroyed === false) {
                this.$doLoad();
            }
        }

        /**
         * 执行资源加载
         */
        protected abstract $doLoad(): void;

        /**
         * 加载所有资源
         */
        protected $loadAssets(urls: string[]): void {
            this.$doneCount = this.$loaders.length;
            for (let i: number = 0; i < urls.length; i++) {
                this.$loaders.push(new UrlSafetyPuppetLoader(urls[i], suncom.Handler.create(this, this.$onLoadAsset)));
            }
        }

        /**
         * 资源加载回调
         */
        private $onLoadAsset(ok: boolean): void {
            if (ok === false) {
                this.$onAssetsLoaded(false);
            }
            else {
                this.$doneCount++;
                if (this.$doneCount === this.$loaders.length) {
                    this.$onAssetsLoaded(true);
                }
            }
        }

        /**
         * 所有资源均己加载成功
         */
        protected abstract $onAssetsLoaded(ok: boolean): void;

        /**
         * 加载结束回调
         */
        protected $onComplete(ok: boolean): void {
            if (this.$destroyed === false) {
                this.$complete.runWith(ok);
            }
            this.destroy();
        }

        /**
         * 获取加载进度
         */
        get progress(): number {
            let value: number = 0;
            for (let i: number = 0; i < this.$loaders.length; i++) {
                value += this.$loaders[i].progress;
            }
            return value / this.$loaders.length;
        }
    }
}