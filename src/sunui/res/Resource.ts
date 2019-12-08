
module sunui {
    /**
     * 资源管理器
     * export
     */
    export namespace Resource {
        /**
         * 查询是否存在资源
         */
        export function has(url: string): boolean {
            const templet: Templet = M.templets[url] || null;
            return templet !== null;
        }

        /**
         * 加载资源
         */
        export function load(url: string, handler: suncom.IHandler): void {
            let templet: Templet = M.templets[url] || null;
            if (templet === null) {
                templet = M.templets[url] = new Templet();
            }
            templet.load(url, handler);
        }

        /**
         * 卸载资源
         */
        export function unload(url: string): void {

        }

        /**
         * 根据资源创建
         */
        export function create(url: string, handler: suncom.IHandler): void {
        }

        /**
         * 销毁对象
         * export
         */
        export function destroy(node: any): void {

        }

        /**
         * 
         */
        function createObjectByUrl(url: string, handler: suncom.IHandler): void {

        }

        /**
         * 创建预置对象
         */
        function createPrefab(url: string, handler: suncom.IHandler): void {
            const res: any = Laya.loader.getRes(url) || null;

            // 若资源不存在，则加载资源
            if (res === null) {
                load(url, suncom.Handler.create(null, createPrefab, [url, handler]));
                return;
            }
        }

        /**
         * 创建龙骨对象
         */
        function createSkeleton(url: string, handler: suncom.IHandler): void {

        }

        /**
         * 创建3D对象
         */
        function createSprite3D(url: string, handler: suncom.IHandler): void {
            Laya.Skeleton;
        }
    }
}