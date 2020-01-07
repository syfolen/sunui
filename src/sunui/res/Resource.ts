
module sunui {
    /**
     * 资源管理器
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
         * 生成组ID（唯一）
         */
        function createGroupId(): number {
            $seedId++;
            return $seedId;
        }

        /**
         * 根据url创建对象
         * @method: 仅支持Skeleton和Texture的创建
         * @flag: 目前仅用于代替aniMode的值
         * 说明：
         * 1. 调用此接口创建对象时，会产生一个计数，当计数为0时，资源会被彻底释放
         * 2. 见destroy方法
         * export
         */
        export function create(url: string, method: (res: any, url: string) => void = null, caller: Object = null, flag: number = 0): any {
            let templet: Templet = $templets[url] || null;
            if (templet === null) {
                templet = $templets[url] = new Templet();
            }
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
         * @node: 显示对象节点，若节点有效，则资源会延时到节点被销毁后再释放
         * @return: 始终返回0
         * export
         */
        export function release(id: number, node: Laya.Node = null): number {
            if (id > 0) {
                if (node !== null) {
                    new ViewContact(null, node).onPopupRemoved(release, null, [id]);
                }
                else {
                    suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, suncom.Handler.create(null, releaseTempletGroup, [id]));
                }
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
    }
}