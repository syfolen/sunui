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
    var ShowPopupCommand = /** @class */ (function (_super) {
        __extends(ShowPopupCommand, _super);
        function ShowPopupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShowPopupCommand.prototype.execute = function (view, duration, trans, props) {
            // 若配置己存在，则说明节点己经被弹出了
            if (sunui.UIManager.getInstance().viewLayer.getInfoByView(view) != null) {
                console.error(view + "[" + view.name + "] was already popup.");
                return;
            }
            // 修正参数
            if (props.keepNode === void 0) {
                props.keepNode = true;
            }
            // 参数列表
            var args = props.args;
            // 显示层级
            var level = view.level || props.level || sunui.UILevel.POPUP;
            // 通透值
            var alpha = trans == true ? 0 : 1;
            // 是否保留节点
            var keepNode = props.keepNode;
            // 显示对象类型
            var viewClass = props.viewClass;
            delete props.args;
            delete props.level;
            delete props.keepNode;
            delete props.viewClass;
            // 避免props不存在
            props = this.$makeProps(props);
            // 创建遮罩
            var mask = sunui.UIManager.getInstance().viewLayer.createMask(view);
            // 生成弹框信息
            var info = {
                view: view,
                viewClass: viewClass,
                mask: mask,
                trans: trans,
                level: level,
                props: props,
                closed: false,
                keepNode: keepNode,
                displayed: false,
                duration: duration,
                cancelAllowed: false
            };
            // 若新视图为POPUP，且存在TOP，则不显示
            var dontPopup = level == sunui.UILevel.POPUP && sunui.UIManager.getInstance().viewLayer.hasTopView() == true;
            if (dontPopup == false) {
                sunui.UIManager.getInstance().viewLayer.addChild(mask);
                var currActiveInfo = sunui.UIManager.getInstance().viewLayer.getActiveViewInfo();
                // 若当前活动的视图为TOP或POPUP，且需要显示的视图亦为TOP或POPUP，则隐藏当前顶层视图
                if (currActiveInfo != null && (currActiveInfo.level == sunui.UILevel.TOP || currActiveInfo.level == sunui.UILevel.POPUP)) {
                    sunui.UIManager.getInstance().viewLayer.removeChild(currActiveInfo.view);
                }
                sunui.UIManager.getInstance().viewLayer.addChild(info.view);
                // 应用缓动数据
                this.$showProps(view, props, duration);
                // 遮罩不通透逻辑处理
                mask[sunui.Tween.Alpha.KEY] = 0;
                sunui.Tween.get(mask).to({ alpha: alpha }, duration, null, suncom.Handler.create(this, this.$onPopupFinish, [view]));
                if (trans == false) {
                    // 获取上一个不通透的对象
                    var stack = sunui.UIManager.getInstance().viewLayer.returnLatestStackNotTrans(view);
                    stack != null && sunui.Tween.get(stack.mask).to({ alpha: 0 }, duration);
                }
            }
            // 保存视图信息
            sunui.UIManager.getInstance().viewLayer.addStack(info);
            // 调用面板弹出事件
            var popup = view;
            popup.$onOpen && popup.$onOpen.apply(view, info.args);
        };
        ShowPopupCommand.prototype.$onPopupFinish = function (view) {
            var info = sunui.UIManager.getInstance().viewLayer.getInfoByView(view);
            if (info == null) {
                return;
            }
            info.displayed = true;
            // 启用面板
            var popup = view;
            popup.$onEnable && popup.$onEnable();
        };
        return ShowPopupCommand;
    }(sunui.AbstractPopupCommand));
    sunui.ShowPopupCommand = ShowPopupCommand;
})(sunui || (sunui = {}));
//# sourceMappingURL=ShowPopupCommand.js.map