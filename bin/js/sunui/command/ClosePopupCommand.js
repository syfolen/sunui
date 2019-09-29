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
    var ClosePopupCommand = /** @class */ (function (_super) {
        __extends(ClosePopupCommand, _super);
        function ClosePopupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ClosePopupCommand.prototype.execute = function (view, duration, destroy) {
            var info = sunui.UIManager.getInstance().viewLayer.getInfoByView(view);
            if (info.closed == true) {
                return;
            }
            if (destroy !== void 0) {
                info.keepNode = !destroy;
            }
            info.closed = true;
            // 应用缓动
            this.$closeProps(view, info.props, duration);
            // 显示上一个视图
            var stack = sunui.UIManager.getInstance().viewLayer.getActiveViewInfo();
            // 只有TOP和POPUP类型的视图才需要重新显示
            if (stack != null && (stack.level == sunui.UILevel.TOP || stack.level == sunui.UILevel.POPUP)) {
                sunui.UIManager.getInstance().viewLayer.addChild(stack.view);
                this.$showProps(stack.view, stack.props, duration);
            }
            sunui.Tween.get(info.mask).to({ alpha: 0 }, duration, null, suncom.Handler.create(this, this.$onCloseFinish, [view]));
            if (info.trans == false) {
                // 获取上一个不通透的对象
                var stack_1 = sunui.UIManager.getInstance().viewLayer.returnLatestStackNotTrans(view);
                stack_1 != null && sunui.Tween.get(stack_1.mask).to({ alpha: 1 }, duration);
            }
            var popup = view;
            popup.$onDisable && popup.$onDisable();
        };
        /**
         * 关闭结束
         */
        ClosePopupCommand.prototype.$onCloseFinish = function (view) {
            var info = sunui.UIManager.getInstance().viewLayer.getInfoByView(view);
            if (info != null) {
                sunui.UIManager.getInstance().viewLayer.removeStackByInfo(info);
            }
            // IPopupView的$onRemove方法在ViewLayer中实现
        };
        return ClosePopupCommand;
    }(sunui.AbstractPopupCommand));
    sunui.ClosePopupCommand = ClosePopupCommand;
})(sunui || (sunui = {}));
//# sourceMappingURL=ClosePopupCommand.js.map