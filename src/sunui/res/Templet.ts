
module sunui {
    /**
     * 模版类
     */
    export class Templet {
        /**
         * 是否己加载
         */
        private $loaded: boolean = false;

        /**
         * 回调列表
         */
        private $handlers: suncom.IHandler[] = [];

        /**
         * 加载资源
         */
        load(url: string, handler: suncom.IHandler): void {
            this.$handlers.push(handler);
        }
    }
}