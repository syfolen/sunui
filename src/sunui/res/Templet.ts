
module sunui {
    /**
     * 资源模版，用于实现资源的动态加载和释放
     */
    export class Templet {
        /**
         * 资源加载器
         */
        private $loader: Loader = new Loader();

        /**
         * 引用计数器
         */
        private $referenceCount: number = 0;

        /**
         * 资源预加载成功后的回调器集合
         */
        private $handlers: suncom.IHandler[] = [];

        /**
         * 模版创建接口
         */
        create(url: string, method: (res: any, url: string) => void, caller: Object): void {
            // 引用计数递增
            this.$referenceCount++;
            // 存在回调执行器
            if (method !== null) {
                this.$handlers.push(suncom.Handler.create(caller, method));
            }
            /**
             * 说明：
             * 1. 此处无论资源是否己得到缓存，都应当重新加载，因为如果不重新加载而直接回调，则回调的发生有可能在外部类的构造函数执行结束之前，这种情况就会引发一些错误
             */
            this.$loader.loading === false && this.$loader.load(url, suncom.Handler.create(this, this.$doCreate));
        }

        private $doCreate(): void {
            const handlers: suncom.IHandler[] = this.$handlers.slice(0);
            this.$handlers = [];

            while (handlers.length > 0) {
                const handler: suncom.IHandler = handlers.shift();
                handler.runWith([this.$loader.create(), this.$loader.url]);
            }
        }

        /**
         * 模版销毁接口
         */
        destroy(url: string, method: (res: any, url: string) => void, caller: Object): void {
            for (let i: number = 0; i < this.$handlers.length; i++) {
                const handler: suncom.IHandler = this.$handlers[i];
                if (handler.method === method && handler.caller === caller) {
                    this.$handlers.splice(i, 1);
                    break;
                }
            }
            // 引用计数递减
            this.$referenceCount--;
            if (this.$referenceCount > 0) {
                return;
            }
            else if (this.$referenceCount < 0) {
                throw Error(`资源计数不应当小于0 url:${url}, references:${this.$referenceCount}`);
            }
            if (this.$referenceCount === 0) {
                this.$loader.destroy();
            }
        }

        get referenceCount(): number {
            return this.$referenceCount;
        }
    }
}