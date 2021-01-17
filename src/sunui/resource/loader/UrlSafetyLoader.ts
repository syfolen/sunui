
module sunui {
    /**
     * URL加载器（安全）
     * 说明：
     * 1. 此类的设计主要用于确保正在执行加载的资源不会被清理
     */
    export class UrlSafetyLoader extends puremvc.Notifier {
        /**
         * 加载网址
         */
        private $url: string = null;

        /**
         * 加载回调
         */
        private $complete: suncom.IHandler = null;

        /**
         * 加载进度 
         */
        protected $progress: number = 0;

        constructor(url: string, complete: suncom.IHandler) {
            super();
            this.$url = url;
            this.$complete = complete;
            this.facade.sendNotification(NotifyKey.ON_URL_SAFETY_LOADER_CREATED, this);
        }

        /**
         * 开始加载
         */
        load(): void {
            RES.lock(this.$url);
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, `load ${this.$url}`);
            }
            const complete: Laya.Handler = Laya.Handler.create(this, this.$onComplete);
            const progress: Laya.Handler = Laya.Handler.create(this, this.$onProgress, void 0, false);
            if (Resource.isFGuiUrl(this.$url) === true) {
                fairygui.UIPackage.loadPackage(this.$url, complete, progress);
            }
            else if (Resource.isRes3dUrl(this.$url) === false || Resource.getRes3dJsonUrl(this.$url) === this.$url) {
                Laya.loader.load(this.$url, complete, progress);
            }
            else {
                Laya.loader.create(this.$url, complete, progress);
            }
        }

        /**
         * 加载结束回调
         */
        protected $onComplete(data: any): void {
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, `load ${this.$url} complete`);
            }
            this.$complete.runWith([data ? true : false, this.$url]);
            this.facade.sendNotification(NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE, this);
            RES.unlock(this.$url);
        }

        /**
         * 加载进度
         */
        protected $onProgress(value: number): void {
            this.$progress = value;
        }

        /**
         * 加载的资源对象链接
         */
        get url(): string {
            return this.$url;
        }

        /**
         * 获取加载进度
         */
        get progress(): number {
            return this.$progress;
        }
    }
}