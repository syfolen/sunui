
module sunui {
    /**
     * 资源加载管理服务
     */
    export class LoadingService extends suncore.BaseService {
        /**
         * 待执行的UrlSafetyLoader
         */
        private $undoList: UrlSafetyLoader[] = [];

        /**
         * 己询问资源是否重新加载
         */
        private $isRetryPrompting: boolean = false;

        /**
         * 正在加载的 URL 集合
         */
        private $loadingMap: { [url: string]: boolean } = {};

        /**
         * 启动回调
         */
        protected $onRun(): void {
            this.facade.registerObserver(NotifyKey.ON_URL_SAFETY_LOADER_CREATED, this.$onUrlSafetyLoaderCreated, this);
            this.facade.registerObserver(NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE, this.$onUrlSafetyLoaderComplete, this);
            this.facade.registerObserver(NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED, this.$onAssetSafetyLoaderFailed, this);
        }

        /**
         * 停止回调
         */
        protected $onStop(): void {
            this.facade.removeObserver(NotifyKey.ON_URL_SAFETY_LOADER_CREATED, this.$onUrlSafetyLoaderCreated, this);
            this.facade.removeObserver(NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE, this.$onUrlSafetyLoaderComplete, this);
            this.facade.removeObserver(NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED, this.$onAssetSafetyLoaderFailed, this);

        }

        /**
         * UrlSafetyLoader创建通知回调
         */
        private $onUrlSafetyLoaderCreated(loader: UrlSafetyLoader): void {
            this.$undoList.unshift(loader);
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, `create loader for url ${loader.url}, loading list length:${M.loaders.length}, undo list length:${this.$undoList.length}`);
            }
            this.$next();
        }

        /**
         * UrlSafetyLoader加载完成通知回调
         */
        private $onUrlSafetyLoaderComplete(loader: UrlSafetyLoader): void {
            const index: number = M.loaders.indexOf(loader);
            suncom.Test.expect(index).toBeGreaterOrEqualThan(0);
            M.loaders.splice(index, 1);
            delete this.$loadingMap[loader.url];
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, `remove loader for url ${loader.url}, loading list length:${M.loaders.length}, undo list length:${this.$undoList.length}`);
            }
            this.$next();
        }

        /**
         * 加载下一个
         */
        private $next(): void {
            while (this.$undoList.length > 0 && M.loaders.length < Laya.loader.maxLoader) {
                let ok: boolean = false;
                for (let i: number = this.$undoList.length - 1; i > -1; i--) {
                    const loader: UrlSafetyLoader = this.$undoList[i];
                    const url: string = loader.url;
                    if (this.$loadingMap[url] === true) {
                        continue;
                    }
                    this.$undoList.splice(i, 1);
                    if (loader.destroyed === true) {
                        continue;
                    }
                    this.$loadingMap[url] = true;

                    ok = true;
                    M.loaders.push(loader);
                    if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                        suncom.Logger.log(suncom.DebugMode.ANY, `load next url ${loader.url}, loading list length:${M.loaders.length}`);
                    }
                    loader.load();
                    break;
                }
                if (ok === false) {
                    break;
                }
            }
        }

        /**
         * AssetSafetyLoader加载失败
         */
        private $onAssetSafetyLoaderFailed(): void {
            if (this.$isRetryPrompting === false) {
                this.$isRetryPrompting = true;
                this.facade.sendNotification(NotifyKey.RETRY_CONFIRM, [
                    suncore.ModuleEnum.SYSTEM,
                    "资源加载失败，点击确定重新尝试！",
                    [ConfirmOptionValueEnum.YES, "确定", ConfirmOptionValueEnum.NO, "取消"],
                    suncom.Handler.create(this, this.$onRetryConfirmed)
                ]);
            }
        }

        /**
         * 资源加载重试
         */
        private $onRetryConfirmed(option: ConfirmOptionValueEnum): void {
            if (option === ConfirmOptionValueEnum.YES) {
                this.facade.sendNotification(NotifyKey.ASSET_SAFETY_LOADER_RETRY);
            }
            else {
                this.facade.sendNotification(suncore.NotifyKey.SHUTDOWN);
            }
            this.$isRetryPrompting = false;
        }
    }
}