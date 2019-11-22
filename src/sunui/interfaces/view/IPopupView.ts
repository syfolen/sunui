
module sunui {
    /**
     * 弹框组件支持的接口
     * export
     */
    export interface IPopupView {
        /**
         * 在弹框创建后调用
         * export
         */
        $onCreate?(...args: any[]): void;

        /**
         * 在弹框打开后调用，弹框将在弹出缓动完成之后被启用
         * export
         */
        $onOpen?(): void;

        /**
         * 在弹框被关闭前调用，弹框将在关闭缓动执行之前被禁用
         * export
         */
        $onClose?(): void;

        /**
         * 在弹框被移除前调用
         * export
         */
        $onRemove?(): void;
    }
}