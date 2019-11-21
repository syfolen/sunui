
module sunui {
    /**
     * export
     */
    export interface ITween {
        /**
         * export
         */
        destroy(): void;
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