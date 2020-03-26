
module sunui {
    /**
     * 资源加载器
     */
    export abstract class AssetLoader {
        /**
         * 是否正在加载
         */
        private $loading: boolean = false;

        /**
         * 加载回调
         */
        private $complete: suncom.IHandler = null;

        /**
         * 己完成的加载器数量
         * 说明：
         * 1. 此属性将在资源URL解析完成后生效
         */
        private $doneCount: number = -1;

        /**
         * 加载网址
         */
        protected $url: string = null;

        /**
         * 加载器列表
         */
        protected $loaders: UrlSafetyLoader[] = [];

        /**
         * 是否己销毁
         */
        private $destroyed: boolean = false;

        constructor(url: string, complete: suncom.IHandler) {
            this.$url = url;
            this.$complete = complete;
            Resource.lock(this.$url);
        }

        /**
         * 销毁加载器
         */
        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            this.$destroyed = true;
            for (let i: number = 0; i < this.$loaders.length; i++) {
                this.$loaders[i].destroy();
            }
            Resource.unlock(this.$url);
        }

        /**
         * 开始加载
         */
        load(): void {
            if (this.$loading === false && this.$destroyed === false) {
                this.$loading = true;
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
                this.$loaders.push(new UrlSafetyLoader(urls[i], suncom.Handler.create(this, this.$onLoadAsset)));
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
        protected $onComplete(ok: boolean, data: any = null): void {
            if (this.$destroyed === false) {
                this.$complete.runWith([ok, data]);
            }
            this.destroy();
            this.$loading = false;
        }

        /**
         * 计算加载进度
         */
        private $calculateProgressValue(): number {
            if (this.$doneCount === -1) {
                return 0;
            }
            else if (this.$doneCount === this.$loaders.length) {
                return 1;
            }
            else {
                let total: number = 0;
                let value: number = 0;
                for (let i: number = 0; i < this.$loaders.length; i++) {
                    total++;
                    value += this.$loaders[i].progress;
                }
                return total === 0 ? 0 : value / total;
            }
        }

        /**
         * 获取加载进度
         */
        get progress(): number {
            return this.$calculateProgressValue();
        }

        /**
         * 是否己销毁
         */
        get destroyed(): boolean {
            return this.$destroyed;
        }
    }
}