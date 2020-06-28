
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
         * 完成加载的资源列表
         */
        private $doneList: string[] = [];

        /**
         * 加载器列表
         */
        private $loaders: AssetSafetyLoader[] = [];

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
        }

        /**
         * 销毁模版，资源会在下一帧被释放
         */
        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();
            // 资源组释放执行函数，此方法由release方法异步调用执行，以避免create回调中的释放请求不生效的问题
            const handler: suncom.IHandler = suncom.Handler.create(this, this.$releaseAllResources);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
        }

        /**
         * 资源加载成功回调
         */
        private $onResourceCreated(url: string): void {
            this.$doneList.push(url);
            if (this.$doneList.length < this.$loaders.length) {
                return;
            }
            if (this.$destroyed === true) {
                return;
            }
            this.$handler.runWith([this.$id]);
        }

        /**
         * 释放所有资源
         */
        private $releaseAllResources(): void {
            for (let i: number = 0; i < this.$loaders.length; i++) {
                this.$loaders[i].destroy();
            }
        }
    }
}