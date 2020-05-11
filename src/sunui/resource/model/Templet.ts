
module sunui {
    /**
     * 资源模版组
     */
    export class Templet {
        /**
         * 模版组ID
         */
        private $id: number = 0;

        /**
         * 资源列表
         */
        private $urls: string[] = null;

        /**
         * 回调执行器
         */
        private $handler: suncom.IHandler = null;

        /**
         * 完成加载的资源列表
         */
        private $doneList: string[] = [];

        /**
         * 是否己销毁
         */
        protected $destroyed: boolean = false;

        constructor(id: number, urls: string[], handler: suncom.IHandler) {
            this.$id = id;
            this.$urls = Resource.checkLoadList(urls);
            this.$handler = handler;
            suncom.Test.expect(this.$urls.length).toBeGreaterThan(0);

            // 预加载资源
            for (let i: number = 0; i < this.$urls.length; i++) {
                const url: string = this.$urls[i];
                Resource.create(url, this.$onResourceCreated, this);
            }
        }

        /**
         * 资源加载成功回调
         */
        private $onResourceCreated(res: any, url: string): void {
            if (res instanceof Laya.Skeleton || res instanceof Laya.Scene3D || res instanceof Laya.Sprite3D) {
                res.destroy();
            }
            this.$doneList.push(url);
            if (this.$doneList.length < this.$urls.length) {
                return;
            }
            if (this.$destroyed === true) {
                return;
            }
            if (M.templets[this.$id]) {
                this.$handler.runWith([this.$id]);
            }
        }

        /**
         * 销毁模版，资源会在下一帧被释放
         */
        destroy(): void {
            if (this.$destroyed === false) {
                this.$destroyed = true;
                // 资源组释放执行函数，此方法由release方法异步调用执行，以避免create回调中的释放请求不生效的问题
                const handler: suncom.IHandler = suncom.Handler.create(this, this.$releaseAllResources);
                suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
            }
        }

        /**
         * 释放所有资源
         */
        private $releaseAllResources(): void {
            for (let i: number = 0; i < this.$urls.length; i++) {
                const url: string = this.$urls[i];
                Resource.destroy(url, this.$onResourceCreated, this);
            }
        }
    }
}