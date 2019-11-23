
module sunui {
    /**
     * 缓动类
     * export
     */
    export interface ITween {

        /**
         * 清除缓动
         * export
         */
        clear(): void;

        /**
         * export
         */
        to(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;

        /**
         * export
         */
        from(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;
    }
}