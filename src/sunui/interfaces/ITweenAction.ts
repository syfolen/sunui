
module sunui {
    /**
     * 缓动动作接口
     */
    export interface ITweenAction {
        /**
         * 属性名
         */
        prop: string;

        /**
         * 开始值
         */
        from: number;

        /**
         * 目标值
         */
        to: number;
    }
}