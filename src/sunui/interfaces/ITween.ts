
module sunui {
    /**
     * 缓动类
     * export
     */
    export interface ITween {

        /**
         * 取消缓动
         * export
         */
        cancel(): ITween;

        /**
         * 从当前属性缓动至props属性
         * export
         */
        to(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;

        /**
         * 从props属性缓动至当前属性
         * export
         */
        from(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;

        /**
         * 等待指定时间
         * export
         */
        wait(delay: number): ITween;

        /**
         * 执行动作
         */
        doAction(): void;

        /**
         * 执行缓动的模块
         */
        readonly mod: suncore.ModuleEnum;

        /**
         * 缓动是否己取消
         */
        readonly canceled: boolean;
    }
}