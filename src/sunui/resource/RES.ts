
module sunui {
    /**
     * 内部资源管理类
     */
    export namespace RES {

        /**
         * 锁定资源，此方法可确保正在使用的资源的安全性
         * 说明：
         * 1. 每次请求锁定资源，资源的引用次数会+1
         * 2. 若为3d资源，则会自动锁定关联的资源配置文件
         * 3. 禁止直接调用此方法来单独锁定3d资源配置文件
         */
        export function lock(url: string): void {
            if (suncom.Global.debugMode > 0) {
                if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                    console.error(`禁止直接调用此方法来单独锁定3d资源配置文件`);
                    return;
                }
            }

            const urls: string[] = [url];
            // 3d资源需要同时锁定json配置文件
            if (Resource.isRes3dUrl(url) === true) {
                const ext: string = suncom.Common.getFileExtension(url);
                const str: string = url.substr(0, url.length - ext.length);
                urls.push(str + "json");
            }

            for (let i: number = 0; i < urls.length; i++) {
                RES.addReference(urls[i]);
            }
        }

        /**
         * 解锁资源，此方法可确保未在使用的资源不会出现内存泄露问题
         * 说明：
         * 1. 每次请求解锁资源时，资源的引用次数会-1
         * 2. 若为3d资源，则会自动解锁关联的资源配置文件
         * 3. 禁止直接调用此方法来单独解锁3d资源配置文件
         * 4. 当2d资源的引用次数为0时，资源会自动释放，当前的加载亦会取消
         * 5. 3d资源只有在资源包的配置文件的引用次数为0时才会释放
         */
        export function unlock(url: string): void {
            if (suncom.Global.debugMode > 0) {
                if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                    console.error(`禁止直接调用此方法来单独解锁3d资源配置文件`);
                    return;
                }
            }

            const urls: string[] = [url];
            // 3d资源需要同时解锁json配置文件
            if (Resource.isRes3dUrl(url) === true) {
                const ext: string = suncom.Common.getFileExtension(url);
                const str: string = url.substr(0, url.length - ext.length);
                urls.push(str + "json");
            }

            for (let i: number = 0; i < urls.length; i++) {
                RES.removeReference(urls[i]);
            }
        }

        /**
         * 锁定Url
         */
        export function addReference(url: string): void {
            const reference: number = M.references[url] || 0;
            M.references[url] = reference + 1;
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, `reference:${reference}, lock:${url}`);
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