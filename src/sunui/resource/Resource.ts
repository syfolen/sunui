
module sunui {
    /**
     * 资源管理器（主要用于资源的动态创建和销毁）
     * export
     */
    export namespace Resource {
        /**
         * 种子ID
         */
        let $seedId: number = 0;

        /**
         * 生成模版ID（唯一）
         */
        function createTempletId(): number {
            $seedId++;
            return $seedId;
        }

        /**
         * 锁定资源
         * 说明：
         * 1. 每次请求锁定资源，则资源的引用次数会-1
         * 2. 若为3d资源，则应当同时锁定资源包的配置文件
         * export
         */
        export function lock(url: string): void {
            // 禁止锁定3d资源配置文件
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                    suncom.Logger.error(`禁止锁定3D资源配置文件：${url}`);
                }
            }
            const ext: string = suncom.Common.getFileExtension(url);
            const str: string = url.substr(0, url.length - ext.length);

            const urls: string[] = [];
            // 图集和龙骨需要同时锁定PNG图片
            if (ext === "sk" || ext === "atlas") {
                urls.push(url);
                urls.push(str + "png");
            }
            // 3d资源需要同时锁定json配置文件
            else if (Resource.isRes3dUrl(url) === true) {
                urls.push(str + "json");
            }
            else {
                urls.push(url);
            }

            for (let i: number = 0; i < urls.length; i++) {
                UrlLocker.lock(urls[i]);
            }
        }

        /**
         * 解锁资源
         * 说明：
         * 1. 每次请求解锁资源时，资源的引用次数会+1
         * 2. 若为3d资源，则应当同时解锁资源包的配置文件
         * 3. 当2d资源的引用次数为0时，资源会自动释放，当前的加载亦会取消
         * 4. 3d资源只有在资源包的配置文件的引用次数为0时才会释放
         * export
         */
        export function unlock(url: string): void {
            // 禁止锁定3d资源配置文件
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                    suncom.Logger.error(`禁止锁定3D资源配置文件：${url}`);
                }
            }
            const ext: string = suncom.Common.getFileExtension(url);
            const str: string = url.substr(0, url.length - ext.length);

            const urls: string[] = [];
            // 图集和龙骨需要同时解锁PNG图片
            if (ext === "sk" || ext === "atlas") {
                urls.push(str + "png");
                urls.push(url);
            }
            // 3d资源只需要解锁json配置文件
            else if (Resource.isRes3dUrl(url) === true) {
                urls.push(str + "json");
            }
            else {
                urls.push(url);
            }

            for (let i: number = 0; i < urls.length; i++) {
                UrlLocker.unlock(urls[i]);
            }
        }

        /**
         * 根据url创建对象
         * @data: 默认为：void 0
         * 说明：
         * 1. 调用此接口创建对象时，会产生一个计数，当计数为0时，资源会被彻底释放
         * 2. 见destroy方法
         * 参数data允许为以下几种类型：
         * 1. aniMode：目前仅支持动画模式，0不支持换装，1、2支持换装，默认值与真正实现加载的Loader有关
         * export
         */
        export function create(url: string, method: (res: any, url: string) => void = null, caller: Object = null, data?: any): any {
            new AssetSafetyLoader(url, suncom.Handler.create(caller, method), data);
        }

        /**
         * 销毁对象
         * 说明：
         * 1. 见create方法
         * 2. 调用此接口销毁对象时，会移除一个计数，当计数为0时，当计数为0时，资源会被彻底释放
         * 3. 若存在有部分逻辑未使用此接口加载资源，却调用此接口销毁资源，则可能会导致该资源被卸载或不可用，请注意
         * export
         */
        export function destroy(url: string, method: (res: any, url: string) => void = null, caller: Object = null): void {
            puremvc.Facade.getInstance().sendNotification(NotifyKey.REMOVE_ASSET_SAFETY_LOADER, [url, null, method, caller]);
        }

        /**
         * 创建3d对象
         * 说明：
         * 1. 同create方法
         * export
         */
        export function createRes3d(name: string | IRes3dName, method: (node: any, url: string) => void, caller: Object): void {
            Resource.create(Resource.getRes3dUrlByName(name), method, caller);
        }

        /**
         * 销毁3d对象
         * 说明：
         * 1. 同destroy方法
         * export
         */
        export function destroyRes3d(name: string | IRes3dName, method: (node: any, url: string) => void, caller: Object): void {
            Resource.destroy(Resource.getRes3dUrlByName(name), method, caller);
        }

        /**
         * 资源预加载
         * @method: 预加载完成时，id大于0，否则等于0，仅支持Skeleton和Texture
         * @return: 返回资源组ID
         * export
         */
        export function prepare(urls: string[], method: (id: number) => void, caller: Object): number {
            let handler: suncom.IHandler = null;
            if (method === null) {
                handler = suncom.Handler.create(null, (id: number): void => { });
            }
            else {
                handler = suncom.Handler.create(caller, method);
            }
            const id: number = createTempletId();
            M.templets[id] = new Templet(id, urls, handler);
            return id;
        }

        /**
         * 释放资源组
         * @id: 资源组ID
         * @return: 始终返回0
         * export
         */
        export function release(id: number): number {
            if (id > 0) {
                const handler: suncom.IHandler = suncom.Handler.create(null, $releaseTemplet, [id]);
                suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
            }
            return 0;
        }

        /**
         * 资源组释放执行函数，此方法由release方法异步调用执行，以避免create回调中的释放请求不生效的问题
         */
        function $releaseTemplet(id: number): void {
            const templet: Templet = M.templets[id] || null;
            if (templet === null) {
                return;
            }
            delete M.templets[id];
            templet.release();
        }

        /**
         * 获取需要加载的资源列表
         */
        export function getLoadList(url: string): string[] {
            const ext: string = suncom.Common.getFileExtension(url);
            if (ext === "sk") {
                return [url.substr(0, url.length - ext.length) + "png", url];
            }
            else {
                return [url];
            }
        }

        /**
         * 获取3d资源包的根目录
         */
        export function getRes3dPackRoot(pack: string): string {
            return `res3d/LayaScene_${pack}/Conventional/`;
        }

        /**
         * 获取3d资源包名
         */
        function $getRes3dPackName(url: string): string {
            const prefix: string = "res3d/LayaScene_";
            const suffix: string = "/Conventional/";

            if (url.indexOf(prefix) !== 0) {
                throw Error(`解析3D资源包名失败 url:${url}`);
            }
            url = url.substr(prefix.length);

            const index: number = url.indexOf(suffix);
            if (index === -1) {
                throw Error(`解析3D资源包名失败 url:${url}`);
            }
            return url.substr(0, index);
        }

        /**
         * 判断是否为3D资源
         */
        export function isRes3dUrl(url: string): boolean {
            return url.indexOf("res3d") === 0;
        }

        /**
         * 获取3D资源的配置文件地址
         */
        export function getRes3dJsonUrl(url: string): string {
            const pack: string = $getRes3dPackName(url);
            return `${Resource.getRes3dPackRoot(pack)}${pack}.json`;
        }

        /**
         * 获取3D资源地址
         * @name: 如xxx.ls
         * @pack: 如LayaScene_xxxx中的xxxx，允许为空
         * 说明：
         * 1. 所有3d资源都必须放在res3d目录下
         * 2. 完整的3D资源目录必须为 res3d/LayaScene_xxxx/Conventional/ 否则将不能正确解析
         * export
         */
        export function getRes3dUrlByName(name: string | IRes3dName): string {
            if (typeof name === "object") {
                return Resource.getRes3dPackRoot(name.pack) + name.name;
            }
            else {
                return Resource.getRes3dPackRoot(suncom.Common.getFileName(name)) + name;
            }
        }

        /**
         * 根据Url清理资源
         * export
         */
        export function clearResByUrl(url: string): void {
            UrlLocker.clearResByUrl(url);
        }
    }
}