
module sunui {
    /**
     * URL加载器（安全）
     * 说明：
     * 1. 该加载器的每个实例均仅只允许被执行一次
     * 2. 此类的设计主要用于确保正在执行加载的资源不会被清理
     */
    export class UrlSafetyLoader extends puremvc.Notifier {
        /**
         * 加载网址
         */
        private $url: string = null;

        /**
         * 下载限制器
         */
        private $limiter: UrlDownloadLimiter = null;

        /**
         * 加载回调
         */
        private $complete: suncom.Handler = null;

        /**
         * 是否正在加载
         */
        private $loading: boolean = false;

        constructor(url: string, complete: suncom.Handler) {
            super();
            this.$url = url;
            this.$complete = complete;
            this.facade.sendNotification(NotifyKey.ON_URL_SAFETY_LOADER_CREATED, this);
        }

        /**
         * 开始加载
         */
        load(): void {
            if (this.$loading === false && this.$destroyed === false) {
                this.$loading = true;
                UrlLocker.lock(this.$url);
                if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                    suncom.Logger.trace(suncom.DebugMode.ANY, `load ${this.$url}`);
                }
                if (Resource.isRes3dUrl(this.$url) === false || Resource.getRes3dJsonUrl(this.$url) === this.$url) {
                    Laya.loader.load(this.$url, Laya.Handler.create(this, this.$onComplete));
                }
                else {
                    Laya.loader.create(this.$url, Laya.Handler.create(this, this.$onComplete));
                }
                if (M.downloadSpeed !== ResourceDownloadSpeedEnum.NONE) {
                    this.$limiter = new UrlDownloadLimiter(this.$url, suncom.Handler.create(this, this.$onDownloaded));
                }
            }
        }

        /**
         * 加载结束回调
         */
        private $onComplete(data: any): void {
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.trace(suncom.DebugMode.ANY, `load ${this.$url} complete`);
            }
            if (this.$limiter === null) {
                if (this.$destroyed === false) {
                    this.$destroyed = true;
                    this.$complete.runWith([data === null ? false : true, this.$url]);
                }
                this.facade.sendNotification(NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE, this);
                UrlLocker.unlock(this.$url);
                this.$loading = false;
            }
            else {
                this.$limiter.updateDownloadSize(data);
            }
        }

        /**
         * 加载结束
         */
        private $onDownloaded(data: any): void {
            this.$limiter = null;
            this.$onComplete(data);
        }

        /**
         * 加载的资源对象链接
         */
        get url(): string {
            return this.$url;
        }

        /**
         * 是否己销毁
         */
        get destroyed(): boolean {
            return this.$destroyed;
        }
    }
}