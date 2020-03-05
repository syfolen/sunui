
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
         * 1. 每次请求锁定资源，则资源的引用次数会加一
         * export
         */
        export function lock(url: string): void {
            const array: string[] = Resource.getLoadList(url);
            for (let i: number = 0; i < array.length; i++) {
                const link: string = array[i];
                const reference: number = $references[link] || 0;
                $references[link] = reference + 1;
            }
        }

        /**
         * 解锁资源
         * 说明：
         * 1. 每次请求解释资源时，资源的引用次数会减一
         * 2. 当资源引用次数为0时，资源会自动释放，当前的加载亦会取消
         * export
         */
        export function unlock(url: string): void {
            const array: string[] = Resource.getLoadList(url);
            for (let i: number = 0; i < array.length; i++) {
                const reference: number = $references[url] || 0;
                if (reference === 0) {
                    throw Error(`尝试解锁不存在的资源 url：${url}`);
                }
                if (reference === 1) {
                    delete $references[url];
                    Laya.loader.clearRes(url);
                    Laya.loader.cancelLoadByUrl(url);
                }
                else {
                    $references[url] = reference - 1;
                }
            }
        }

        /**
         * 查询资源的引用次数
         */
        export function getReferenceByUrl(url: string): number {
            return $references[url] || 0;
        }

        /**
         * 根据url创建对象
         * @method: 仅支持Skeleton和Texture的创建
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
                console.log("================== resouce debug ==================");
                const keys: string[] = Object.keys($templets);
                for (const key of keys) {
                    const templet: Templet = $templets[key];
                    console.log(`url:${key}, references:${templet.referenceCount}`);
                }
                console.log("================== resouce debug ==================");
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
                templet.destroy(url, method, caller);
                Resource.unlock(url);
                if (templet.referenceCount === 0) {
                    delete $templets[url];
                }
            }
            if ((suncom.Global.debugMode & suncom.DebugMode.DEBUG) === suncom.DebugMode.DEBUG) {
                console.log("================== resouce debug ==================");
                const keys: string[] = Object.keys($templets);
                for (const key of keys) {
                    const templet: Templet = $templets[key];
                    console.log(`url:${key}, references:${templet.referenceCount}`);
                }
                console.log("================== resouce debug ==================");
            }
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
                const handler: suncom.IHandler = suncom.Handler.create(null, releaseTempletGroup, [id]);
                suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
            }
            return 0;
        }

        /**
         * 资源组释放执行函数，此方法由release方法异步调用执行，以避免create回调中的释放请求不生效的问题
         */
        function releaseTempletGroup(id: number): void {
            const group: TempletGroup = $groups[id] || null;
            if (group !== null) {
                delete $groups[id];
                group.release();
            }
        }

        /**
         * 获取需要加载的资源列表
         */
        export function getLoadList(url: string): string[] {
            const index: number = url.lastIndexOf(".");
            const str: string = url.substr(0, index);
            const ext: string = url.substr(index + 1);
            if (ext === "sk") {
                return [
                    str + ".sk",
                    str + ".png"
                ];
            }
            else {
                return [url];
            }
        }
    }
}