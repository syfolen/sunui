
module sunui {
    /**
     * 资源加载器（预加载专用）
     */
    export class Loader extends suncom.EventSystem {
        /**
         * 资源链接
         */
        private $url: string = null;

        /**
         * 加载器
         */
        private $loader: UrlLoader = null;

        /**
         * 是否正在加载
         */
        private $loading: boolean = false;

        /**
         * 是否己销毁
         */
        private $destroyed: boolean = false;

        /**
         * 加载重试机
         */
        private $retryer: Retryer = null;

        constructor() {
            super();
            this.$retryer = new Retryer(
                RetryMethodEnum.CONFIRM | suncore.ModuleEnum.SYSTEM,
                suncom.Handler.create(this, this.$onRetryConfirmed),
                "资源加载失败，点击确定重新尝试！",
                ConfirmOptionValueEnum.YES, "确定",
                ConfirmOptionValueEnum.NO, "取消"
            );
        }

        /**
         * 加载资源
         */
        load(url: string): void {
            if (this.$loading === false) {
                this.$loading = true;
                this.$url = url;
                this.$doLoad(false);
            }
        }

        /**
         * 执行加载行为
         */
        private $doLoad(destroyLoader: boolean): void {
            if (destroyLoader === true) {
                this.$loader.destroy();
            }
            else if (this.$loader === null) {
                const handler: suncom.IHandler = suncom.Handler.create(this, this.$onLoad);
                if (Resource.isRes3dUrl(this.$url) === true) {
                    this.$loader = new Res3dLoader(this.$url, handler);
                }
                else if (suncom.Common.getFileExtension(this.$url) === "sk") {
                    this.$loader = new SkeletonLoader(this.$url, handler);
                }
                else {
                    this.$loader = new UrlLoader(this.$url, handler);
                }
            }
            this.$loader.load();
        }

        /**
         * 结束加载
         */
        private $onLoad(ok: boolean): void {
            if (this.$destroyed === false) {
                // 若资源加载失败，则尝试重新加载（无次数限制）
                if (ok === false) {
                    this.$retryer.run(1000, suncom.Handler.create(this, this.$doLoad, [true]), 2);
                }
                else {
                    // 重置标记
                    this.$loading = false;
                    // 派发己加载事件
                    this.dispatchEvent(EventKey.LOADED);
                }
            }
        }

        /**
         * 询问得到回复
         */
        private $onRetryConfirmed(option: ConfirmOptionValueEnum): void {
            if (this.$destroyed === false) {
                if (option === ConfirmOptionValueEnum.YES) {
                    this.$doLoad(true);
                    this.$retryer.reset();
                }
                else {
                    puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.SHUTDOWN);
                }
            }
        }

        /**
         * 销毁加载器
         */
        destroy(): void {
            if (this.$destroyed === false) {
                this.$destroyed = true;
                this.$loading = false;
                this.$loader.destroy();
                this.$retryer.cancel();
            }
        }

        /**
         * 创建对象
         */
        create(): any {
            return this.$loader.create();
        }

        /**
         * 是否正在加载
         */
        get loading(): boolean {
            return this.$loading;
        }

        /**
         * 资源链接
         */
        get url(): string {
            return this.$url;
        }
    }
}