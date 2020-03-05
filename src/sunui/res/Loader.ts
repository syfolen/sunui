
module sunui {
    /**
     * 资源加载器（预加载专用）
     */
    export class Loader extends puremvc.Notifier {
        /**
         * 哈希值
         */
        private $hashId: number = suncom.Common.createHashId();

        /**
         * 资源链接
         */
        private $url: string = null;

        /**
         * 资源对象
         */
        private $templet: Laya.Templet = null;

        /**
         * 加载成功回调
         */
        private $handler: suncom.IHandler = null;

        /**
         * 是否正在加载
         */
        private $loading: boolean = false;

        /**
         * 加载重试机
         */
        private $retryer: Retryer = null;

        constructor() {
            super();
            this.$retryer = new Retryer(
                RetryMethodEnum.CONFIRM | suncore.ModuleEnum.SYSTEM,
                suncom.Handler.create(this, this.$onRetryConfirmed, [this.$hashId]),
                "资源加载失败，点击确定重新尝试！",
                ConfirmOptionValueEnum.YES, "确定",
                ConfirmOptionValueEnum.NO, "取消"
            );
        }

        /**
         * 加载资源
         * @flag: 目前仅用于代替aniMode的值
         */
        load(url: string, handler: suncom.IHandler): void {
            if (this.$loading === false) {
                this.$loading = true;
                this.$url = url;
                this.$handler = handler;
                this.$doLoad();
            }
        }

        /**
         * 执行加载行为
         */
        private $doLoad(): void {
            // 不存在动画模版时，只需要重新加载资源即可
            if (this.$templet === null) {
                Laya.loader.load(Resource.getLoadList(this.$url), Laya.Handler.create(this, this.$onLoad));
            }
            // 重新加载动画
            else {
                this.$templet.loadAni(this.$url);
            }
        }

        /**
         * 结束加载
         */
        private $onLoad(ok: boolean): void {
            // 若资源加载失败，则尝试重新加载（无次数限制）
            if (ok === false) {
                this.$retryer.run(1000, suncom.Handler.create(this, this.$doLoad), 2);
            }
            else if (this.getResExtByUrl(this.$url) === "sk" && this.$templet === null) {
                this.$templet = new Laya.Templet();
                this.$templet.on(Laya.Event.ERROR, this, this.$onLoad, [false]);
                this.$templet.on(Laya.Event.COMPLETE, this, this.$onLoad, [true]);
                this.$templet.loadAni(this.$url);
            }
            else {
                // 重置标记
                this.$loading = false;
                // 执行回调器
                this.$handler.run();
            }
        }

        /**
         * 询问得到回复
         */
        private $onRetryConfirmed(hashId: number, option: ConfirmOptionValueEnum): void {
            if (this.$hashId === hashId) {
                if (option === ConfirmOptionValueEnum.YES) {
                    this.$doLoad();
                    this.$retryer.reset();
                }
                else {
                    this.facade.sendNotification(suncore.NotifyKey.SHUTDOWN);
                }
            }
        }

        /**
         * 销毁加载器
         */
        destroy(): void {
            this.$hashId = 0;
            this.$handler = null;
            this.$loading = false;
            // 销毁动画模版
            if (this.$templet !== null) {
                this.$templet.off(Laya.Event.ERROR, this, this.$onLoad);
                this.$templet.off(Laya.Event.COMPLETE, this, this.$onLoad);
                this.$templet.destroy();
                this.$templet = null;
            }
        }

        /**
         * 根据URL获取资源后缀名
         */
        getResExtByUrl(url: string): string {
            return url.substr(url.lastIndexOf(".") + 1);
        }

        /**
         * 创建对象
         */
        create(): Laya.Texture | Laya.Skeleton {
            let res: any = null;
            if (this.$templet === null) {
                res = Laya.loader.getRes(this.$url) || null;
            }
            else {
                res = this.$templet.buildArmature(2) || null;
            }
            if (res === null) {
                throw Error(`资源预加载出错 url:${this.$url}`);
            }
            return res;
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