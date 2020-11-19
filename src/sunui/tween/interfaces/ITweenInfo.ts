
module sunui {
    /**
     * 缓动信息接口
     */
    export interface ITweenInfo {
        /**
         * 缓动函数
         */
        ease: Function;

        /**
         * 动作列表
         */
        actions: ITweenAction[];

        /**
         * 更新回调
         */
        update: suncom.IHandler;

        /**
         * 结束回调
         */
        complete: suncom.IHandler;

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