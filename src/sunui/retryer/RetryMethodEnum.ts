
module sunui {
    /**
     * 重试类型枚举
     * export
     */
    export enum RetryMethodEnum {
        /**
         * 直接重试（默认）
         * export
         */
        NONE = 0x10,

        /**
         * 确认框，包含是和否选项
         * export
         */
        CONFIRM = 0x20
    }
}