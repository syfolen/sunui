var sunui;
(function (sunui) {
    var UILevel;
    (function (UILevel) {
        /**
         * 未设置
         */
        UILevel[UILevel["NONE"] = 0] = "NONE";
        /**
         * 背景
         */
        UILevel[UILevel["BACKGROUND"] = 1] = "BACKGROUND";
        /**
         * 场景
         */
        UILevel[UILevel["SCENE"] = 2] = "SCENE";
        /**
         * 面板，可同时显示多个，且可同时操作多个，当前被操作的面板将置顶显示
         * TODO: 面板暂时是没有实现的，因为没有使用的地方
         */
        UILevel[UILevel["PANEL"] = 3] = "PANEL";
        /**
         * 飘浮对象
         */
        UILevel[UILevel["FLOAT"] = 4] = "FLOAT";
        /**
         * 普通类型视图，可同时显示多个，但只允许操作最新弹出的视图
         */
        UILevel[UILevel["VIEW"] = 5] = "VIEW";
        /**
         * 弹出类型视图，有多个弹出对象时，只会显示最新弹出的视图对象，历史视图将在当前视图被关闭后自动重新弹出
         */
        UILevel[UILevel["POPUP"] = 6] = "POPUP";
        /**
         * 异步框对象
         */
        UILevel[UILevel["WAITINGBOX"] = 7] = "WAITINGBOX";
        /**
         * 加载界面
         */
        UILevel[UILevel["LOADING"] = 8] = "LOADING";
        /**
         * 轻提示
         */
        UILevel[UILevel["TIPS"] = 9] = "TIPS";
        /**
         * 顶级弹出对象，特性与POPUP相同，一般情况下只适用于警告、错误等信息提示
         */
        UILevel[UILevel["TOP"] = 10] = "TOP";
        /**
         * 测试对象，处在最顶层
         */
        UILevel[UILevel["DEBUG"] = 11] = "DEBUG";
    })(UILevel = sunui.UILevel || (sunui.UILevel = {}));
})(sunui || (sunui = {}));
//# sourceMappingURL=UILevel.js.map