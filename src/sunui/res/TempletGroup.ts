
module sunui {
    /**
     * 资源模版组
     */
    export class TempletGroup {
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
            this.$urls = urls;
            this.$handler = handler;
            // 预加载资源
            for (let i: number = 0; i < this.$urls.length; i++) {
                const url: string = this.$urls[i];
                Resource.create(url, this.$onResourceCreated, this);
            }
        }

        private $onResourceCreated(res: any, url: string): void {
            if (res instanceof Laya.Skeleton) {
                res.destroy();
            }
            this.$doneList.push(url);

            // 预加载未完成
            if (this.$doneList.length < this.$urls.length) {
                return;
            }
            this.$handler.runWith([this.$id]);
        }

        release(): void {
            for (let i: number = 0; i < this.$urls.length; i++) {
                const url: string = this.$urls[i];
                Resource.destroy(url, this.$onResourceCreated, this);
            }
        }
    }
}