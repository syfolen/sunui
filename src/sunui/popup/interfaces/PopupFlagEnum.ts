
module sunui {
    /**
     * 弹出标记枚举
     * export
     */
    export enum PopupFlagEnum {
        /**
         * 无
         * export
         */
        NONE = 0x0,

        /**
         * 禁用缓动
         * export
         */
        SIMPLY = 0x1,

        /**
         * 背景通透
         * export
         */
        TRANSPARENT = 0x2,

        /**
         * 允许鼠标穿透
         * export
         */
        MOUSE_THROUGH = 0x4,

        /**
         * 同步淡入淡出时间
         * 说明：
         * 1. 正常情况下背景蒙灰时间为200毫秒
         * 2. 若启用此标记，则蒙灰时间与弹出设定时间一致
         * export
         */
        SYNC_FADE_TIME = 0x8
    }
}