var sunui;
(function (sunui) {
    /**
     * export
     */
    var UILevel;
    (function (UILevel) {
        /**
         * 未设置
         * export
         */
        UILevel[UILevel["NONE"] = 0] = "NONE";
        /**
         * 背景
         * export
         */
        UILevel[UILevel["BACKGROUND"] = 1] = "BACKGROUND";
        /**
         * 场景
         * export
         */
        UILevel[UILevel["SCENE"] = 2] = "SCENE";
        /**
         * 面板，可同时显示多个，且可同时操作多个，当前被操作的面板将置顶显示
         * TODO: 面板暂时是没有实现的，因为没有使用的地方
         * export
         */
        UILevel[UILevel["PANEL"] = 3] = "PANEL";
        /**
         * 飘浮对象
         * export
         */
        UILevel[UILevel["FLOAT"] = 4] = "FLOAT";
        /**
         * 普通类型视图，可同时显示多个，但只允许操作最新弹出的视图
         * export
         */
        UILevel[UILevel["VIEW"] = 5] = "VIEW";
        /**
         * 金币获得
         * export
         */
        UILevel[UILevel["GOLD_TIPS"] = 6] = "GOLD_TIPS";
        /**
         * 高倍金币
         * export
         */
        UILevel[UILevel["HIGH_GOLD_TIPS"] = 7] = "HIGH_GOLD_TIPS";
        /**
         * 播报信息
         * export
         */
        UILevel[UILevel["NOTICE"] = 8] = "NOTICE";
        /**
         * 小游戏
         * export
         */
        UILevel[UILevel["MINI_GAME"] = 9] = "MINI_GAME";
        /**
         * 弹出类型视图，有多个弹出对象时，只会显示最新弹出的视图对象，历史视图将在当前视图被关闭后自动重新弹出
         * export
         */
        UILevel[UILevel["POPUP"] = 10] = "POPUP";
        /**
         * 异步框对象
         * export
         */
        UILevel[UILevel["WAITINGBOX"] = 11] = "WAITINGBOX";
        /**
         * 加载界面
         * export
         */
        UILevel[UILevel["LOADING"] = 12] = "LOADING";
        /**
         * 轻提示
         * export
         */
        UILevel[UILevel["TIPS"] = 13] = "TIPS";
        /**
         * 顶级弹出对象，特性与POPUP相同，一般情况下只适用于警告、错误等信息提示
         * export
         */
        UILevel[UILevel["TOP"] = 14] = "TOP";
        /**
         * 测试对象，处在最顶层
         * export
         */
        UILevel[UILevel["DEBUG"] = 15] = "DEBUG";
    })(UILevel = sunui.UILevel || (sunui.UILevel = {}));
})(sunui || (sunui = {}));
//# sourceMappingURL=UILevel.js.map