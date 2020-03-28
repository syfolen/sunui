
module sunui {
    /**
     * Url锁
     * 说明：
     * 1. 一个url仅锁定一个资源
     * 2. 释放3d资源json配置文件时会同时释放其所有的关联资源
     */
    export namespace UrlLocker {

        /**
         * 锁定Url
         */
        export function lock(url: string): void {
            const reference: number = M.references[url] || 0;
            M.references[url] = reference + 1;
        }

        /**
         * 解锁Url
         * 说明：
         * 1. 当Url引用计数为0时，会清理其对应的资源
         */
        export function unlock(url: string): void {
            const reference: number = M.references[url] || 0;
            if (reference === 0) {
                throw Error(`尝试解锁不存在的资源 url：${url}`);
            }
            else if (reference === 1) {
                delete M.references[url];
                $clearRes(url);
            }
            else {
                M.references[url] = reference - 1;
            }
        }

        /**
         * 根据Url清理资源
         */
        export function clearResByUrl(url: string): void {
            const item: any = Laya.loader.getRes(url) || null;
            if (item !== null) {
                item.dispose && item.dispose();
                item.destroy && item.destroy();
            }
            Laya.loader.clearRes(url);
            Laya.loader.cancelLoadByUrl(url);
        }

        /**
         * 清理资源
         */
        function $clearRes(url: string): void {
            // 清理3d资源json配置文件
            if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                const urls: string[] = $getAssetUrlsByRes3dJson(Laya.loader.getRes(url));
                for (let i: number = 0; i < urls.length; i++) {
                    UrlLocker.clearResByUrl(urls[i]);
                }
            }
            // 若存在全局缓存，则销毁
            const res: any = M.cacheMap[url] || null;
            if (res !== null) {
                delete M.cacheMap[url];
                res.dispose && res.dispose();
                res.destroy && res.destroy();
            }
            UrlLocker.clearResByUrl(url);
        }

        /**
         * 根据JSON配置获取所有3D资源列表
         */
        function $getAssetUrlsByRes3dJson(json: IRes3dJsonFile): string[] {
            const urls: string[] = [];
            const root: string = Resource.getRes3dPackRoot(json.pack);

            for (let i: number = 0; i < json.files.length; i++) {
                urls.push(root + json.files[i]);
            }
            for (let i: number = 0; i < json.resources.length; i++) {
                urls.push(root + json.resources[i]);
            }

            return urls;
        }
    }
}