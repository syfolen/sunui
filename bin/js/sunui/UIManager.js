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
            if (UIManager.inst == null) {
                UIManager.inst = new UIManager();
            }
            return UIManager.inst;
        };
        /**
         * 注册视图层
         * export
         */
        UIManager.prototype.regViewLayer = function (layer) {
            this.viewLayer = layer;
        };
        /**
         * 注册场景层
         * export
         */
        UIManager.prototype.regSceneLayer = function (layer) {
            this.sceneLayer = layer;
        };
        /**
         * 注册视图基类
         */
        UIManager.prototype.regBaseViewClass = function (cls) {
            this.baseViewClass = cls;
        };
        /**
         * 注册场景基类
         */
        UIManager.prototype.regBaseSceneClass = function (cls) {
            this.baseSceneClass = cls;
        };
        ////////////////////////////////////////////////////////////////////////////////////////
        // 场景相关
        /**
         * 进入新场景，并将当前场景压入历史
         * export
         */
        UIManager.prototype.enterScene = function (name, args) {
            this.sceneLayer.enterScene(name, args);
        };
        /**
         * 退出当前场景，并返回历史
         * export
         */
        UIManager.prototype.exitScene = function () {
            this.sceneLayer.exitScene();
        };
        /**
         * 替换当前场景
         * 说明：被替换的场景不会进入历史
         * export
         */
        UIManager.prototype.replaceScene = function (name, args) {
            this.sceneLayer.replaceScene(name, args);
        };
        /**
         * 判断当前场景是否为指定类型的场景
         */
        UIManager.prototype.isCurrentSceneMatch = function (sceneClass) {
            return this.sceneLayer.isCurrentSceneMatch(sceneClass);
        };
        Object.defineProperty(UIManager.prototype, "uiScene", {
            /**
             * 获取场景对象
             * export
             */
            get: function () {
                return this.sceneLayer.uiScene;
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
                return this.sceneLayer.d3Scene;
            },
            enumerable: true,
            configurable: true
        });
        ////////////////////////////////////////////////////////////////////////////////////////
        // 视图相关
        /**
         * 是否存在指定类型的视图
         * @viewClass:视图类型
         */
        UIManager.prototype.hasView = function (viewClass) {
            return this.viewLayer.hasView(viewClass);
        };
        /**
         * 显示普通类型视图
         */
        UIManager.prototype.showView = function (viewClass, args, props) {
            if (props === void 0) { props = {}; }
            props.level = sunui.UILevel.VIEW;
            this.viewLayer.showView(viewClass, args, props);
        };
        /**
         * 关闭普通类型视图
         */
        UIManager.prototype.closeView = function (view) {
            this.viewLayer.closeView(view);
        };
        /**
         * 移除普通类型视图
         */
        UIManager.prototype.removeView = function (view) {
            this.viewLayer.removeStackByView(view);
        };
        /**
         * 根据视图类型移除视图
         */
        UIManager.prototype.removeViewByClass = function (viewClass) {
            this.viewLayer.removeStackByViewClass(viewClass);
        };
        /**
         * 显示PANEL类型的视图
         */
        UIManager.prototype.showPanel = function (viewClass, args, props) {
            if (props === void 0) { props = {}; }
            props.level = sunui.UILevel.PANEL;
            this.viewLayer.showView(viewClass, args, props);
        };
        /**
         * 显示POPUP类型视图
         */
        UIManager.prototype.showPopup = function (viewClass, args, props) {
            if (props === void 0) { props = {}; }
            props.level = sunui.UILevel.POPUP;
            this.viewLayer.showView(viewClass, args, props);
        };
        /**
         * 显示TOP类型视图
         */
        UIManager.prototype.showTopView = function (viewClass, args, props) {
            if (props === void 0) { props = {}; }
            props.level = sunui.UILevel.TOP;
            this.viewLayer.showView(viewClass, args, props);
        };
        /**
         * 根据消息内容获取提示框
         */
        UIManager.prototype.searchPopupViewByMessage = function (message) {
            return this.viewLayer.searchPopupViewByMessage(message);
        };
        UIManager.inst = null;
        return UIManager;
    }());
    sunui.UIManager = UIManager;
})(sunui || (sunui = {}));
//# sourceMappingURL=UIManager.js.map