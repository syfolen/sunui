var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var sunui;
(function (sunui) {
    /**
     * export
     */
    var UIManager = /** @class */ (function (_super) {
        __extends(UIManager, _super);
        /**
         * 弹框命令应当在此处被注册
         */
        function UIManager() {
            var _this = _super.call(this) || this;
            sunui.M.viewLayer = new sunui.ViewLayerLaya3D();
            sunui.M.sceneLayer = new sunui.SceneLayer();
            _this.facade.registerCommand(sunui.NotifyKey.SHOW_POPUP, sunui.ShowPopupCommand);
            _this.facade.registerCommand(sunui.NotifyKey.CLOSE_POPUP, sunui.ClosePopupCommand);
            return _this;
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
         * 单例对象
         */
        UIManager.$inst = null;
        return UIManager;
    }(puremvc.Notifier));
    sunui.UIManager = UIManager;
})(sunui || (sunui = {}));
//# sourceMappingURL=UIManager.js.map