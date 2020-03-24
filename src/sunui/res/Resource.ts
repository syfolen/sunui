
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
         * 组集合
         */
        const $groups: { [id: number]: TempletGroup } = {};

        /**
         * 模版集合
         */
        const $templets: { [url: string]: Templet } = {};

        /**
         * 资源索引集合
         */
        const $references: { [url: string]: number } = {};

        /**
         * 生成组ID（唯一）
         */
        function createGroupId(): number {
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
            const reference: number = $references[url] || 0;
            $references[url] = reference + 1;
            if (Resource.isRes3dUrl(url) === true && suncom.Common.getFileExtension(url) !== "json") {
                Resource.lock(Resource.getRes3dJsonUrl(url));
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
            const reference: number = $references[url] || 0;
            if (reference === 0) {
                throw Error(`尝试解锁不存在的资源 url：${url}`);
            }
            else if (reference === 1) {
                delete $references[url];
                if (Resource.isRes3dUrl(url) === false) {
                    $clearRes2d(url);
                }
                else {
                    $clearRes3d(url);
                }
            }
            else {
                $references[url] = reference - 1;
            }
            // 若为3d资源，且不为json文件，则需要解锁配置文件
            if (Resource.isRes3dUrl(url) === true && suncom.Common.getFileExtension(url) !== "json") {
                Resource.unlock(Resource.getRes3dJsonUrl(url));
            }
        }

        /**
         * 释放2d资源
         */
        function $clearRes2d(url: string): void {
            const urls: string[] = Resource.getUnloadList(url);
            for (let i: number = 0; i < urls.length; i++) {
                const path: string = urls[i];
                $clearRes(path);
            }
        }

        /**
         * 释放3d资源
         */
        function $clearRes3d(url: string): void {
            if (Resource.getRes3dJsonUrl(url) === url) {
                const json: IRes3dJsonFile = Laya.loader.getRes(url);
                const root: string = $getRes3dPackRoot(json.pack);
                for (let i: number = 0; i < json.files.length; i++) {
                    const path: string = root + json.files[i];
                    $clearRes(path);
                }
                for (let i: number = 0; i < json.resources.length; i++) {
                    const path: string = root + json.resources[i];
                    $clearRes(path);
                }
                Laya.loader.clearRes(url);
            }
            else {
                Laya.loader.cancelLoadByUrl(url);
            }
        }

        /**
         * 根据URL释放资源对象
         */
        function $clearRes(url: string): void {
            const item: any = Laya.loader.getRes(url) || null;
            if (item !== null) {
                item.dispose && item.dispose();
                item.destroy && item.destroy();
            }
            Laya.loader.clearRes(url);
            Laya.loader.cancelLoadByUrl(url);
        }

        /**
         * 根据url创建对象
         * 说明：
         * 1. 调用此接口创建对象时，会产生一个计数，当计数为0时，资源会被彻底释放
         * 2. 见destroy方法
         * export
         */
        export function create(url: string, method: (res: any, url: string) => void = null, caller: Object = null): any {
            let templet: Templet = $templets[url] || null;
            if (templet === null) {
                templet = $templets[url] = new Templet();
            }
            Resource.lock(url);
            templet.create(url, method, caller);
            if ((suncom.Global.debugMode & suncom.DebugMode.DEBUG) === suncom.DebugMode.DEBUG) {
                suncom.Logger.log("================== resouce debug ==================");
                const keys: string[] = Object.keys($templets);
                for (const key of keys) {
                    const templet: Templet = $templets[key];
                    suncom.Logger.log(`url:${key}, references:${templet.referenceCount}`);
                }
                suncom.Logger.log("================== resouce debug ==================");
            }
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
            let templet: Templet = $templets[url] || null;
            if (templet !== null) {
                Resource.unlock(url);
                templet.destroy(url, method, caller);
                if (templet.referenceCount === 0) {
                    delete $templets[url];
                }
            }
            if ((suncom.Global.debugMode & suncom.DebugMode.DEBUG) === suncom.DebugMode.DEBUG) {
                suncom.Logger.log("================== resouce debug ==================");
                const keys: string[] = Object.keys($templets);
                for (const key of keys) {
                    const templet: Templet = $templets[key];
                    suncom.Logger.log(`url:${key}, references:${templet.referenceCount}`);
                }
                suncom.Logger.log("================== resouce debug ==================");
            }
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
            const id: number = createGroupId();
            $groups[id] = new TempletGroup(id, urls, handler);
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
                const handler: suncom.IHandler = suncom.Handler.create(null, $releaseTempletGroup, [id]);
                suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
            }
            return 0;
        }

        /**
         * 资源组释放执行函数，此方法由release方法异步调用执行，以避免create回调中的释放请求不生效的问题
         */
        function $releaseTempletGroup(id: number): void {
            const group: TempletGroup = $groups[id] || null;
            if (group === null) {
                return;
            }
            delete $groups[id];
            group.release();
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
         * 获取需要卸载的资源列表
         */
        export function getUnloadList(url: string): string[] {
            const ext: string = suncom.Common.getFileExtension(url);
            if (ext === "sk") {
                return [url, url.substr(0, url.length - ext.length) + "png"];
            }
            else if (ext === "atlas") {
                return [url, url.substr(0, url.length - ext.length) + "png"];
            }
            else {
                return [url];
            }
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
         * 获取3D资源的配置文件地址
         */
        export function getRes3dJsonUrl(url: string): string {
            const pack: string = $getRes3dPackName(url);
            return `${$getRes3dPackRoot(pack)}${pack}.json`;
        }

        /**
         * 获取3d资源包的根目录
         */
        function $getRes3dPackRoot(pack: string): string {
            return `res3d/LayaScene_${pack}/Conventional/`;
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
                return $getRes3dPackRoot(name.pack) + name.name;
            }
            else {
                return $getRes3dPackRoot(suncom.Common.getFileName(name)) + name;
            }
        }

        /**
         * 判断是否为3D资源
         */
        export function isRes3dUrl(url: string): boolean {
            return url.indexOf("res3d") === 0;
        }
    }
}