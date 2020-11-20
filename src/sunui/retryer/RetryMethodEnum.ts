
module sunui {
    /**
     * 重试类型枚举
     * export
     */
    export enum RetryMethodEnum {
        /**
         * 自动重试（默认）
         * export
         */
        AUTO = 0x10,

        /**
         * 请求确认，包含是和否选项
         * export
         */
        CONFIRM = 0x20,

        /**
         * 终止重试
         * export
         */
        TERMINATE = 0x40
    }
}