
module sunui {
    /**
     * 内部资源管理类
     */
    export namespace RES {

        /**
         * 锁定Url
         */
        export function addReference(url: string): void {
            const reference: number = M.references[url] || 0;
            M.references[url] = reference + 1;
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, `reference:${reference + 1}, lock:${url}`);
            }
        }

        /**
         * 解锁Url
         * 说明：
         * 1. 当Url引用计数为0时，会清理其对应的资源
         */
        export function removeReference(url: string): void {
            const reference: number = M.references[url] || 0;
            suncom.Test.expect(reference).interpret(`尝试解锁不存在的资源 url：${url}`).toBeGreaterThan(0);
            M.references[url] = reference - 1;
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, `reference:${reference - 1}, unlock:${url}`);
            }
            if (reference === 1) {
                delete M.references[url];
                $deleteCachedObject(url);
            }
        }

        /**
         * 删除缓存对象
         */
        function $deleteCachedObject(url: string): void {
            // 清理3d资源json配置文件
            if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                const urls: string[] = $parseRes3dJson(Laya.loader.getRes(url));
                for (let i: number = 0; i < urls.length; i++) {
                    RES.clearResByUrl(urls[i]);
                }
            }
            RES.clearResByUrl(url);
        }

        /**
         * 解析 Res3d json 文件
         * @return: 3d资源列表
         */
        function $parseRes3dJson(json: IRes3dJsonFile): string[] {
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

        /**
         * 根据Url清理资源
         */
        export function clearResByUrl(url: string): void {
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, `clearResUrl:${url}`);
            }
            // 销毁fairygui资源
            if (Resource.isFGuiUrl(url) === true) {
                return fairygui.UIPackage.removePackage(url);
            }
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

            const suffix: string = suncom.Common.getFileExtension(url);
            if (suffix === "ani") {
                Laya.Animation.clearCache(url);
            }
            else if (suffix === "sk") {
                Laya.Templet.TEMPLET_DICTIONARY[url] && Laya.Templet.TEMPLET_DICTIONARY[url].destroy();
                delete Laya.Templet.TEMPLET_DICTIONARY[url];
            }
        }
    }
}