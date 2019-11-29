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
     * 关闭弹框命令
     */
    var ClosePopupCommand = /** @class */ (function (_super) {
        __extends(ClosePopupCommand, _super);
        function ClosePopupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ClosePopupCommand.prototype.execute = function (view, duration, destroy) {
            var info = sunui.M.viewLayer.getInfoByView(view);
            if (info === null) {
                console.error(view + "[" + view.name + "]'s infomation is not exist.");
                return;
            }
            if (info.closed == true) {
                return;
            }
            if (destroy !== void 0) {
                info.keepNode = !destroy;
            }
            // 标记弹框己关闭
            info.closed = true;
            // 应用缓动
            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                this.$applyCloseProps(view, info.props, duration);
            }
            // 调用IPopupView的$onDisable接口
            sunui.M.viewLayer.onViewClose(view);
            this.facade.sendNotification(sunui.NotifyKey.ON_POPUP_CLOSED, view);
            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                var handler = suncom.Handler.create(this, this.$onCloseFinish, [view]);
                sunui.Tween.get(info.mask, suncore.ModuleEnum.CUSTOM).to({ alpha: 0 }, duration, null, handler);
            }
        };
        /**
         * 缓动结束
         */
        ClosePopupCommand.prototype.$onCloseFinish = function (view) {
            // IPopupView的$onRemove方法在ViewLayer中实现
            sunui.M.viewLayer.removeStackByView(view);
        };
        return ClosePopupCommand;
    }(sunui.AbstractPopupCommand));
    sunui.ClosePopupCommand = ClosePopupCommand;
})(sunui || (sunui = {}));
//# sourceMappingURL=ClosePopupCommand.js.map