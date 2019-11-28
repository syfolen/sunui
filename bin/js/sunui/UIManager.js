var sunui;
(function (sunui) {
    /**
     * export
     */
    var UIManager = /** @class */ (function () {
        function UIManager() {
        }
        /**
         * export
         */
        UIManager.getInstance = function () {
            if (UIManager.$inst == null) {
                UIManager.$inst = new UIManager();
            }
            return UIManager.$inst;
        };
        /**
         * 进入新场景，并将当前场景压入历史
         * @args: 参数列表，场景参数列表在进入下一个场景时会自动被保存，在返回场景时会被重新传入，在返回上一个场景时被丢弃
         * export
         */
        UIManager.prototype.enterScene = function (name, args) {
            sunui.M.sceneLayer.enterScene(name, args);
        };
        /**
         * 退出当前场景，并返回历史
         * export
         */
        UIManager.prototype.exitScene = function () {
            sunui.M.sceneLayer.exitScene();
        };
        /**
         * 替换当前场景
         * 说明：被替换的场景不会进入历史
         * export
         */
        UIManager.prototype.replaceScene = function (name, args) {
            sunui.M.sceneLayer.replaceScene(name, args);
        };
        Object.defineProperty(UIManager.prototype, "uiScene", {
            /**
             * 获取场景对象
             * export
             */
            get: function () {
                return sunui.M.sceneLayer.uiScene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIManager.prototype, "d3Scene", {
            /**
             * 获取场景对象
             * export
             */
            get: function () {
                return sunui.M.sceneLayer.d3Scene;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 是否存在指定类型的视图
         * @viewClass:视图类型
         */
        UIManager.prototype.hasView = function (viewClass) {
            return sunui.M.viewLayer.hasView(viewClass);
        };
        /**
         * 显示普通类型视图
         */
        UIManager.prototype.showView = function (viewClass, args, props) {
            if (props === void 0) { props = {}; }
            props.level = sunui.UILevel.POPUP;
            sunui.M.viewLayer.showView(viewClass, args, props);
        };
        /**
         * 关闭普通类型视图
         */
        UIManager.prototype.closeView = function (view) {
            sunui.M.viewLayer.closeView(view);
        };
        /**
         * 移除普通类型视图
         */
        UIManager.prototype.removeView = function (view) {
            sunui.M.viewLayer.removeStackByView(view);
        };
        /**
         * 根据视图类型移除视图
         */
        UIManager.prototype.removeViewByClass = function (viewClass) {
            sunui.M.viewLayer.removeStackByViewClass(viewClass);
        };
        /**
         * 显示PANEL类型的视图
         */
        UIManager.prototype.showPanel = function (viewClass, args, props) {
            if (props === void 0) { props = {}; }
            props.level = sunui.UILevel.PANEL;
            sunui.M.viewLayer.showView(viewClass, args, props);
        };
        /**
         * 显示TOP类型视图
         */
        UIManager.prototype.showTopView = function (viewClass, args, props) {
            if (props === void 0) { props = {}; }
            props.level = sunui.UILevel.TOP;
            sunui.M.viewLayer.showView(viewClass, args, props);
        };
        /**
         * 单例对象
         */
        UIManager.$inst = null;
        return UIManager;
    }());
    sunui.UIManager = UIManager;
})(sunui || (sunui = {}));
//# sourceMappingURL=UIManager.js.map