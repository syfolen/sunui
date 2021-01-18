
module sunui {
    /**
     * 资源模版组
     */
    export class Templet extends puremvc.Notifier {
        /**
         * 模版组ID
         */
        private $id: number = 0;

        /**
         * 回调执行器
         */
        private $handler: suncom.IHandler = null;

        /**
         * 加载器列表
         */
        private $loaders: AssetSafetyLoader[] = [];

        /**
         * 完成加载的资源列表
         */
        private $doneList: string[] = [];

        /**
         * 加载进度
         */
        private $progress: number = -1;

        constructor(id: number, urls: string[], handler: suncom.IHandler) {
            super();
            this.$id = id;
            this.$handler = handler;

            urls = Resource.checkLoadList(urls);
            suncom.Test.expect(urls.length).toBeGreaterThan(0);

            while (urls.length > 0) {
                const url: string = urls.shift();
                const handler: suncom.IHandler = suncom.Handler.create(this, this.$onResourceCreated);
                const loader: AssetSafetyLoader = new AssetSafetyLoader(url, handler);
                this.$loaders.push(loader);
            }
            this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        }

        /**
         * 资源加载成功回调
         */
        private $onResourceCreated(url: string): void {
            if (this.$destroyed === true) {
                return;
            }
            this.$doneList.push(url);
            if (this.$doneList.length < this.$loaders.length) {
                return;
            }
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            this.$handler.runWith([this.$id, 1]);
        }

        /**
         * 通知加载进度
         */
        private $onEnterFrame(): void {
            let progress: number = 0;
            for (let i: number = 0; i < this.$loaders.length; i++) {
                progress += this.$loaders[i].progress;
            }
            progress /= this.$loaders.length;
            if (this.$progress === progress) {
                return;
            }
            this.$progress = progress;
            if (this.$handler.method.length === 2) {
                this.$handler.runWith([this.$id, this.$progress]);
            }
        }

        /**
         * 销毁模版，资源会在下一帧被释放
         */
        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();

            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            // 资源组释放执行函数，此方法由release方法异步调用执行，以避免create回调中的释放请求不生效的问题
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, this, this.$releaseAllResources);
        }

        /**
         * 释放所有资源
         */
        private $releaseAllResources(): void {
            while (this.$loaders.length > 0) {
                this.$loaders.pop().destroy();
            }
        }
    }
}