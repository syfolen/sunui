
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
            if (M.templets[this.$id]) {
                this.$handler.runWith([this.$id]);
            }
        }

        /**
         * 释放所有资源
         */
        release(): void {
            for (let i: number = 0; i < this.$urls.length; i++) {
                const url: string = this.$urls[i];
                Resource.destroy(url, this.$onResourceCreated, this);
            }
        }
    }
}