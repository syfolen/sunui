
module sunui {
    /**
     * 网络地址加载器
     */
    export class UrlLoader {
        /**
         * 网络地址
         */
        protected $url: string = null;

        /**
         * 加载回调
         */
        protected $handler: suncom.IHandler = null;

        constructor(url: string, handler: suncom.IHandler) {
            this.$url = url;
            this.$handler = handler;
            this.$doLoad();
        }

        /**
         * 开始加载
         */
        protected $doLoad(): void {
            Laya.loader.load(Resource.getLoadList(this.$url), Laya.Handler.create(this, this.$onLoad));
        }

        /**
         * 完成加载
         */
        protected $onLoad(ok: boolean): void {
            if (this.$handler !== null) {
                this.$handler.runWith(ok);
            }
            if (ok === false) {
                this.destroy();
            }
        }

        /**
         * 销毁加载器
         */
        destroy(): void {
            this.$handler = null;
            this.$url = null;
        }

        /**
         * 创建对象
         */
        create(): any {
            return Laya.loader.getRes(this.$url) || null;
        }
    }
}