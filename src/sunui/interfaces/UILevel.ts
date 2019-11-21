
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
         * 普通类型视图，可同时显示多个，但只允许操作最新弹出的视图
         * export
         */
        VIEW,

        /**
         * 弹出类型视图，有多个弹出对象时，只会显示最新弹出的视图对象，历史视图将在当前视图被关闭后自动重新弹出
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
         * export
         */
        LOADING,

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