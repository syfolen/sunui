
module sunui {
    /**
     * 资源加载器（预加载专用）
     */
    export class Loader extends puremvc.Notifier {
        /**
         * 最大重试次数
         */
        static readonly RETRY_TIMES_MAX: number = 3;

        /**
         * 资源对象
         */
        private $templet: Laya.Templet = null;

        /**
         * 资源链接
         */
        private $url: string = null;

        /**
         * 加载成功回调
         */
        private $handler: suncom.IHandler = null;

        /**
         * 是否正在加载
         */
        private $loading: boolean = false;

        /**
         * 重试次数
         */
        private $retryTimes: number = 0;

        /**
         * 加载重试定时器
         */
        private $retryTimerId: number = 0;

        /**
         * 加载资源
         * @flag: 目前仅用于代替aniMode的值
         */
        load(url: string, handler: suncom.IHandler): void {
            if (this.$loading === false) {
                this.$loading = true;
                this.$url = url;
                this.$handler = handler;
                Laya.loader.load(this.$getLoadList(url), Laya.Handler.create(this, this.$onLoad));
            }
        }

        /**
         * 结束加载
         */
        private $onLoad(ok: boolean): void {
            // 若资源加载失败，则尝试重新加载（无次数限制）
            if (ok === false) {
                if (this.$templet === null) {
                    console.log(`资源加载失败：url:${this.$url}，1秒后重新尝试...`);
                }
                else {
                    console.log(`动画初始化失败：url:${this.$url}，1秒后重新尝试...`);
                }
                this.$retryTimes++;
                if (this.$retryTimes < Loader.RETRY_TIMES_MAX) {
                    this.$retryTimerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, 1000, this.$reload, this);
                }
                else {
                    this.facade.sendNotification(NotifyKey.LOAD_ASSETS_FAILED, suncom.Handler.create(this, this.$onReloadConfirmed));
                }
                return;
            }

            if (this.getResExtByUrl(this.$url) === "sk") {
                if (this.$templet === null) {
                    this.$templet = new Laya.Templet();
                    this.$templet.on(Laya.Event.ERROR, this, this.$onLoad, [false]);
                    this.$templet.on(Laya.Event.COMPLETE, this, this.$onLoad, [true]);
                    this.$templet.loadAni(this.$url);
                    return;
                }
            }
            // 重置标记
            this.$loading = false;
            // 执行回调器
            this.$handler.run();
        }

        /**
         * 询问得到回复
         */
        private $onReloadConfirmed(yes: boolean): void {
            if (yes === true) {
                this.$retryTimes = 0;
                this.$reload();
            }
            else {
                this.facade.sendNotification(suncore.NotifyKey.SHUTDOWN);
            }
        }

        /**
         * 重新尝试加载
         */
        private $reload(): void {
            // 不存在动画模版时，只需要重新加载资源即可
            if (this.$templet === null) {
                Laya.loader.load(this.$getLoadList(this.$url), Laya.Handler.create(this, this.$onLoad));
            }
            // 重新加载动画
            else {
                this.$templet.loadAni(this.$url);
            }
            // 重置定时器索引
            this.$retryTimerId = 0;
        }

        /**
         * 销毁加载器
         */
        destroy(): void {
            this.$handler = null;
            this.$loading = false;
            // 销毁动画模版
            if (this.$templet !== null) {
                this.$templet.off(Laya.Event.ERROR, this, this.$onLoad);
                this.$templet.off(Laya.Event.COMPLETE, this, this.$onLoad);
                this.$templet.destroy();
                this.$templet = null;
            }
            // 卸载当前正在使用的资源
            const loadList: string[] = this.$getLoadList(this.$url);
            for (let i: number = 0; i < loadList.length; i++) {
                const url: string = loadList[i];
                Laya.loader.clearRes(url);
            }
            // 取消当前正在进行的加载
            Laya.loader.cancelLoadByUrls(this.$getLoadList(this.$url));
            // 取消定时器
            this.$retryTimerId = suncore.System.removeTimer(this.$retryTimerId);
        }

        /**
         * 获取需要加载的资源列表
         */
        private $getLoadList(url: string): string[] {
            const index: number = url.lastIndexOf(".");
            const str: string = url.substr(0, index);
            const ext: string = url.substr(index + 1);
            if (ext === "sk") {
                return [
                    str + ".sk",
                    str + ".png"
                ];
            }
            else {
                return [url];
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