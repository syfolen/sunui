
module sunui {
    /**
     * 资源管理器
     * export
     */
    export namespace Resource {

        let $seedId: number = 0;

        const $groups: { [id: number]: TempletGroup } = {};

        const $templets: { [url: string]: Templet } = {};

        function createGroupId(): number {
            $seedId++;
            return $seedId;
        }

        /**
         * 根据url创建对象
         * @flag: 目前仅用于代替aniMode的值
         * 说明：
         * 1. 调用此接口创建对象时，会产生一个计数，当计数为0时，资源会被彻底释放
         * 2. 见destroy方法
         * export
         */
        export function create(url: string, method: Function = null, caller: Object = null, flag: number = 0): any {
            console.log(`create ${url}`);
            let templet: Templet = $templets[url] || null;
            if (templet === null) {
                templet = $templets[url] = new Templet();
            }
            templet.create(url, method, caller, flag);
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
         * 3. 若此方法执行完之后，计数依然大于0，且loading尚未完成，则create中指定的回调依然会在资源加载完成之后被执行，UI应当自行避免回调的这种执行
         * 4. 若存在有部分逻辑未使用此接口加载资源，却调用此接口销毁资源，则可能会导致该资源被卸载或不可用，请注意
         * export
         */
        export function destroy(url: string, method: Function = null, caller: Object = null): void {
            console.log(`destroy ${url}`);
            let templet: Templet = $templets[url] || null;
            if (templet !== null) {
                templet.destroy(url, method, caller);
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
         * @return: 返回资源组ID
         * export
         */
        export function prepare(urls: string[], method: Function, caller: Object): number {
            if (method === null) {
                for (let i: number = 0; i < urls.length; i++) {
                    const url: string = urls[i];
                    create(url);
                }
                return 0;
            }
            else {
                const id: number = createGroupId();
                $groups[id] = new TempletGroup(id, urls, Laya.Handler.create(caller, method));
                return id;
            }
        }

        /**
         * 释放资源组
         * @id: 资源组ID
         * @return: 始终返回0
         * export
         */
        export function release(id: number): number {
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, suncom.Handler.create(null, releaseEx, [id]));
            return 0;
        }

        /**
         * 资源组释放执行函数，此方法由release方法异步调用执行，以避免create回调中的释放请求不生效的问题
         */
        function releaseEx(id: number): void {
            const group: TempletGroup = $groups[id] || null;
            if (group !== null) {
                delete $groups[id];
                group.release();
            }
        }
    }
}