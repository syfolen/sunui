
module sunui {
    /**
     * URL加载器（安全）
     * 说明：
     * 1. 该加载器的每个实例均仅只允许被执行一次
     * 2. 此类的设计主要用于确保正在执行加载的资源不会被清理
     * export
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
         * 是否正在加载
         */
        private $loading: boolean = false;

        /**
         * 是否己销毁
         */
        private $destroyed: boolean = false;

        constructor(url: string, complete: suncom.IHandler) {
            super();
            this.$url = url;
            this.$complete = complete;
            this.facade.sendNotification(NotifyKey.ON_URL_SAFETY_LOADER_CREATED, this);
        }

        /**
         * 销毁加载器
         */
        destroy(): void {
            this.$destroyed = true;
        }

        /**
         * 开始加载
         */
        load(): void {
            if (this.$loading === false && this.$destroyed === false) {
                this.$loading = true;
                UrlLocker.lock(this.$url);
                if (Resource.isRes3dUrl(this.$url) === false || Resource.getRes3dJsonUrl(this.$url) === this.$url) {
                    Laya.loader.load(this.$url, Laya.Handler.create(this, this.$onComplete));
                }
                else {
                    Laya.loader.create(this.$url, Laya.Handler.create(this, this.$onComplete));
                }
            }
        }

        /**
         * 加载结束回调
         */
        protected $onComplete(data: any): void {
            if (this.$destroyed === false) {
                this.$destroyed = true;
                this.$complete.runWith([data === null ? false : true, this.$url]);
            }
            this.facade.sendNotification(NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE, this);
            UrlLocker.unlock(this.$url);
            this.$loading = false;
        }

        /**
         * 是否己销毁
         */
        get destroyed(): boolean {
            return this.$destroyed;
        }
    }
}