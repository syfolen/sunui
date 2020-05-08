
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
            suncom.Test.expect(reference).interpret(`尝试解锁不存在的资源 url：${url}`).toBeGreaterThan(0);
            if (reference > 1) {
                M.references[url] = reference - 1;
            }
            else {
                delete M.references[url];
                $clearRes(url);
            }
        }

        /**
         * 根据Url清理资源
         */
        export function clearResByUrl(url: string): void {
            // 销毁自定义缓存
            let item: any = M.cacheMap[url] || null;
            if (item !== null) {
                item.dispose && item.dispose();
                item.destroy && item.destroy();
                delete M.cacheMap[url];
            }
            // 销毁系统缓存
            const res: any = Laya.loader.getRes(url) || null;
            if (res === null) {
                Laya.loader.cancelLoadByUrl(url);
            }
            else {
                res.dispose && res.dispose();
                res.destroy && res.destroy();
                Laya.loader.clearRes(url);
            }
        }

        /**
         * 清理资源
         */
        function $clearRes(url: string): void {
            // 清理3d资源json配置文件
            if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                const urls: string[] = Resource.getAssetUrlsByRes3dJson(Laya.loader.getRes(url));
                for (let i: number = 0; i < urls.length; i++) {
                    UrlLocker.clearResByUrl(urls[i]);
                }
            }
            UrlLocker.clearResByUrl(url);
        }
    }
}