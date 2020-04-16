
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
         * AssetSafetyLoader加载器缓存
         * 说明：
         * 1. 缓存加载器作为解锁资源的依据
         */
        private $cacheLoaders: { [url: string]: AssetSafetyLoader[] } = {};

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

            this.facade.registerObserver(NotifyKey.CACHE_ASSET_SAFETY_LOADER, this.$onCacheAssetSafetyLoader, this);
            this.facade.registerObserver(NotifyKey.REMOVE_ASSET_SAFETY_LOADER, this.$onRemoveAssetSafetyLoader, this);

            this.facade.registerObserver(NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED, this.$onAssetSafetyLoaderFailed, this);
        }

        /**
         * 停止回调
         */
        protected $onStop(): void {
            this.facade.removeObserver(NotifyKey.ON_URL_SAFETY_LOADER_CREATED, this.$onUrlSafetyLoaderCreated, this);
            this.facade.removeObserver(NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE, this.$onUrlSafetyLoaderComplete, this);

            this.facade.removeObserver(NotifyKey.CACHE_ASSET_SAFETY_LOADER, this.$onCacheAssetSafetyLoader, this);
            this.facade.removeObserver(NotifyKey.REMOVE_ASSET_SAFETY_LOADER, this.$onRemoveAssetSafetyLoader, this);
            this.facade.removeObserver(NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED, this.$onAssetSafetyLoaderFailed, this);

        }

        /**
         * UrlSafetyLoader创建通知回调
         */
        private $onUrlSafetyLoaderCreated(loader: UrlSafetyLoader): void {
            this.$undoList.push(loader);
            this.$next();
        }

        /**
         * UrlSafetyLoader加载完成通知回调
         */
        private $onUrlSafetyLoaderComplete(loader: UrlSafetyLoader): void {
            const index: number = this.$loadingList.indexOf(loader);
            if (index > -1) {
                this.$loadingList.splice(index, 1);
                this.$next();
            }
        }

        /**
         * 加载下一个
         */
        private $next(): void {
            while (this.$undoList.length > 0 && this.$loadingList.length < ResourceService.MAX_LOAD_COUNT) {
                const loader: UrlSafetyLoader = this.$undoList.shift();
                if (loader.destroyed === false) {
                    loader.load();
                    this.$loadingList.push(loader);
                }
            }
        }

        /**
         * 缓存AssetSafetyLoader
         */
        private $onCacheAssetSafetyLoader(url: string, loader: AssetSafetyLoader): void {
            let loaders: AssetSafetyLoader[] = this.$cacheLoaders[url] || null;
            if (loaders === null) {
                loaders = this.$cacheLoaders[url] = [];
            }
            loaders.push(loader);
            Resource.lock(url);
        }

        /**
         * 移除AssetSafetyLoader
         */
        private $onRemoveAssetSafetyLoader(url: string, loader: AssetSafetyLoader, method: Function, caller: Object): void {
            const loaders: AssetSafetyLoader[] = this.$cacheLoaders[url] || null;
            if (loaders === null) {
                return;
            }

            let index: number = -1;
            if (loader === null) {
                for (let i: number = 0; i < loaders.length; i++) {
                    const item: AssetSafetyLoader = loaders[i];
                    if (item.complete.method === method && item.complete.caller === caller) {
                        index = i;
                        break;
                    }
                }
            }
            else {
                index = loaders.indexOf(loader);
            }

            if (index > -1) {
                loaders.splice(index, 1);
                if (loaders.length === 0) {
                    delete this.$cacheLoaders[url];
                }
                Resource.unlock(url);
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