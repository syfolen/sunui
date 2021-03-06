
module sunui {
    /**
     * export
     */
    export enum UILevel {
        /**
         * 未设置
         * export
         */
        NONE = 0,

        /**
         * 背景
         * export
         */
        BACKGROUND,

        /**
         * 场景
         * export
         */
        SCENE,

        /**
         * 面板，可同时显示多个，且可同时操作多个，当前被操作的面板将置顶显示
         * TODO: 面板暂时是没有实现的，因为没有使用的地方
         * export
         */
        PANEL,

        /**
         * 飘浮对象
         * export
         */
        FLOAT,

        /**
         * 金币获得
         * export
         */
        GOLD_TIPS,

        /**
         * 高倍金币
         * export
         */
        HIGH_GOLD_TIPS,

        /**
         * 播报信息
         * export
         */
        NOTICE,

        /**
         * 大赢家
         * export
         */
        BIGWINNER,

        /**
         * 小游戏
         * export
         */
        MINI_GAME,

        /**
         * 通用类型，默认的弹出方式，可同时显示多个，但只允许操作最新弹出的视图
         * export
         */
        POPUP,

        /**
         * 异步框对象
         * export
         */
        WAITINGBOX,

        /**
         * 加载界面
         * 说明：
         * 1. 层级低于加载界面的在场景中显示
         * 2. 层级等于或高于加载界面的在舞台中显示
         * export
         */
        LOADING,

        /**
         * 跑马灯提示
         * export
         */
        LAMP_TIPS,

        /**
         * 轻提示
         * export
         */
        TIPS,

        /**
         * 顶级弹出对象，特性与POPUP相同，一般情况下只适用于警告、错误等信息提示
         * export
         */
        TOP,

        /**
         * 测试对象，处在最顶层
         * export
         */
        DEBUG
    }
}