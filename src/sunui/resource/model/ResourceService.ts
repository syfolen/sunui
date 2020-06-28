
module sunui {
    /**
     * 资源加载管理服务
     */
    export class ResourceService extends suncore.BaseService {
        /**
         * 允许同时加载的最大个数
         * export
         */
        static readonly MAX_LOAD_COUNT: number = 5;

        /**
         * 待执行的UrlSafetyLoader
         */
        private $undoList: UrlSafetyLoader[] = [];

        /**
         * 正在执行的UrlSafetyLoader
         */
        private $loadingList: UrlSafetyLoader[] = [];

        /**
         * 己询问资源是否重新加载
         */
        private $isRetryPrompting: boolean = false;

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
                suncom.Logger.trace(suncom.DebugMode.ANY, `create loader for url ${loader.url}, loading list length:${this.$loadingList.length}, undo list length:${this.$undoList.length}`);
            }
            this.$next();
        }

        /**
         * UrlSafetyLoader加载完成通知回调
         */
        private $onUrlSafetyLoaderComplete(loader: UrlSafetyLoader): void {
            const index: number = this.$loadingList.indexOf(loader);
            suncom.Test.expect(index).toBeGreaterOrEqualThan(0);

            this.$loadingList.splice(index, 1);
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.trace(suncom.DebugMode.ANY, `remove loader for url ${loader.url}, loading list length:${this.$loadingList.length}, undo list length:${this.$undoList.length}`);
            }

            this.$next();
        }

        /**
         * 加载下一个
         */
        private $next(): void {
            while (this.$undoList.length > 0 && this.$loadingList.length < ResourceService.MAX_LOAD_COUNT) {
                let ok: boolean = false;
                for (let i: number = this.$undoList.length - 1; i > -1; i--) {
                    const loader: UrlSafetyLoader = this.$undoList[i];
                    if (loader.destroyed === true) {
                        this.$undoList.splice(i, 1);
                        continue;
                    }
                    if (this.$isUrlInLoading(loader.url) === true) {
                        continue;
                    }
                    if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                        suncom.Logger.trace(suncom.DebugMode.ANY, `load next url ${loader.url}, loading list length:${this.$loadingList.length} + 1`);
                    }
                    ok = true;
                    loader.load();
                    this.$loadingList.push(loader);
                    break;
                }
                if (ok === false) {
                    break;
                }
            }
        }

        /**
         * 判断被请求的Url是否正在加载
         */
        private $isUrlInLoading(url: string): boolean {
            for (let i: number = 0; i < this.$loadingList.length; i++) {
                const loader: UrlSafetyLoader = this.$loadingList[i];
                if (loader.url === url) {
                    return true;
                }
            }
            return false;
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