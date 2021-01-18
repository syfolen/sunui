
module sunui {
    /**
     * 资源加载器（安全）
     * 说明：
     * 1. 此类的设计主要用于确保资源加载必然成功
     * 2. 此对象持有对资源的引用，可确保资源不会被重复加载
     */
    export class AssetSafetyLoader extends puremvc.Notifier {
        /**
         * 资源链接
         */
        private $url: string = null;

        /**
         * 资源加载回调
         */
        private $complete: suncom.IHandler = null;

        /**
         * 加载器
         */
        private $loader: AssetLoader = null;

        /**
         * 加载重试机
         */
        private $retryer: Retryer = new Retryer(RetryMethodEnum.TERMINATE, suncom.Handler.create(this, this.$onRetryConfirmed), "资源加载失败！");

        constructor(url: string, complete: suncom.IHandler) {
            super();
            RES.lock(url);
            this.$url = url;
            this.$complete = complete;
            this.$doLoad();
        }

        /**
         * 执行资源加载
         */
        private $doLoad(): void {
            const handler: suncom.IHandler = suncom.Handler.create(this, this.$onLoad);
            if (Resource.isFGuiUrl(this.$url) === true) {
                this.$loader = new FGuiLoader(this.$url, handler);
            }
            else if (Resource.isRes3dUrl(this.$url) === true) {
                this.$loader = new Res3dLoader(this.$url, handler);
            }
            else if (suncom.Common.getFileExtension(this.$url) === "sk") {
                this.$loader = new SkeletonLoader(this.$url, handler);
            }
            else {
                this.$loader = new UrlLoader(this.$url, handler);
            }
            this.$loader.load();
        }

        /**
         * 加载结束回调
         */
        private $onLoad(ok: boolean): void {
            // 派发己加载事件
            if (ok === true) {
                this.$complete.runWith(this.$url);
            }
            // 若资源加载失败，则尝试重新加载
            else {
                this.$retryer.run(1000, suncom.Handler.create(this, this.$doLoad), 2);
            }
        }

        /**
         * 销毁加载器
         */
        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();
            this.facade.removeObserver(NotifyKey.ASSET_SAFETY_LOADER_RETRY, this.$onAssetSafetyLoaderRetry, this);
            this.$loader.destroy();
            this.$retryer.cancel();
            RES.unlock(this.$url);
        }

        /**
         * 询问得到回复
         */
        private $onRetryConfirmed(option: ConfirmOptionValueEnum): void {
            if (option === ConfirmOptionValueEnum.NO) {
                this.$retryer.reset();
                suncom.Logger.warn(suncom.DebugMode.ANY, `失败：${this.$url}`);
                this.facade.sendNotification(NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED);
                this.facade.registerObserver(NotifyKey.ASSET_SAFETY_LOADER_RETRY, this.$onAssetSafetyLoaderRetry, this, true);
            }
            else {
                this.facade.sendNotification(suncore.NotifyKey.SHUTDOWN);
            }
        }

        /**
         * 重新尝试加载
         */
        private $onAssetSafetyLoaderRetry(): void {
            if (this.$destroyed === false) {
                suncom.Logger.warn(suncom.DebugMode.ANY, `重试：${this.$url}`);
                this.$doLoad();
            }
        }

        get progress(): number {
            return this.$loader.progress;
        }
    }
}