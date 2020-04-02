
module sunui {
    /**
     * 下载速度限制
     * export
     */
    export enum ResourceDownloadSpeedEnum {
        /**
         * 无限制
         * export
         */
        NONE = 0,

        /**
         * 快（1M）
         * export
         */
        HIGH = 1024 * 1024 / 8,

        /**
         * 中等（256K）
         * export
         */
        MID = 256 * 1024 / 8,

        /**
         * 慢（64K）
         * export
         */
        LOW = 64 * 1024 / 8
    }
}