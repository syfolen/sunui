
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
            this.$urls = this.$removeDuplicateResources(urls);
            this.$handler = handler;

            // 龙骨无需加载png资源
            this.$removeUnnecessaryResources(this.$urls, "sk", "png", "龙骨预加载无需指定PNG资源");
            // 图集无需加载png资源
            this.$removeUnnecessaryResources(this.$urls, "atlas", "png", "图集预加载无需指定PNG资源");

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
            if (this.$doneList.length === this.$urls.length) {
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

        /**
         * 移除重复的资源
         */
        private $removeDuplicateResources(urls: string[]): string[] {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                const array: string[] = [];
                for (let i: number = 0; i < urls.length; i++) {
                    const url: string = urls[i];
                    if (array.indexOf(url) === -1) {
                        array.push(url);
                    }
                    else {
                        suncom.Logger.error(`重复的预加载资源文件 ${url}`);
                    }
                }
                return array;
            }
            return urls;
        }

        /**
         * 根据扩展名移除无需指定的资源文件
         */
        private $removeUnnecessaryResources(urls: string[], match: string, remove: string, msg: string): void {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                const array: string[] = [];

                for (let i: number = 0; i < urls.length; i++) {
                    const url: string = urls[i];
                    if (suncom.Common.getFileExtension(url) === match) {
                        array.push(url);
                    }
                }

                for (let i: number = 0; i < array.length; i++) {
                    const url: string = array[i];
                    const png: string = url.substring(0, url.length - match.length) + remove;
                    do {
                        const index: number = urls.indexOf(png);
                        if (index === -1) {
                            break;
                        }
                        urls.splice(index, 1);
                        suncom.Logger.warn(`${msg} ${url}`);
                    } while (true);
                }
            }
        }
    }
}