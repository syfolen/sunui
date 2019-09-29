
module sunui {

    /**
     * 缓动配置接口
     */
    export interface ITweenConfig {
        /**
         * 缓动函数
         */
        ease: Function;

        /**
         * 缓动回调
         */
        handler: suncom.IHandler;

        /**
         * 开始时间
         */
        time: number;

        /**
         * 缓动时间
         */
        duration: number;
    }
}