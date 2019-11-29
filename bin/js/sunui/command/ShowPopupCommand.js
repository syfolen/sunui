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
     * 打开弹框命令
     */
    var ShowPopupCommand = /** @class */ (function (_super) {
        __extends(ShowPopupCommand, _super);
        function ShowPopupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShowPopupCommand.prototype.execute = function (view, duration, props) {
            // 若配置己存在，则说明节点己经被弹出了
            if (sunui.M.viewLayer.getInfoByView(view) !== null) {
                console.error(view + "[" + view.name + "] is already popup.");
                return;
            }
            // 提供默认的缓动方法
            if (props.ease === void 0) {
                props.ease = Laya.Ease.backOut;
            }
            // 默认背景通透为0.6
            if (props.trans === void 0) {
                props.trans = 0.6;
            }
            // 默认不保存节点
            if (props.keepNode === void 0) {
                props.keepNode = false;
            }
            // 参数列表
            var args = props.args;
            // 背景通透值
            var trans = props.trans;
            // 显示层级
            var level = view.zOrder || props.level || sunui.UILevel.POPUP;
            // 是否保留节点
            var keepNode = props.keepNode;
            // 显示对象类型
            var viewClass = props.viewClass;
            delete props.args;
            delete props.trans;
            delete props.level;
            delete props.keepNode;
            delete props.viewClass;
            // 避免props的默认属性不存在
            props = this.$makeProps(props);
            // 创建遮罩
            var mask = sunui.M.viewLayer.createMask(view);
            mask.name = "Mask$" + view.name;
            mask.alpha = trans;
            mask.zOrder = view.zOrder = level;
            // 生成弹框信息
            var info = {
                view: view,
                viewClass: viewClass,
                mask: mask,
                level: level,
                props: props,
                closed: false,
                keepNode: keepNode,
                displayed: false,
                duration: duration,
                cancelAllowed: false
            };
            // 保存视图信息
            sunui.M.viewLayer.addStack(info);
            // 显示视图
            sunui.M.viewLayer.addChild(mask);
            sunui.M.viewLayer.addChild(view);
            // 应用缓动数据
            this.$applyShowProps(view, props, duration);
            // 调用IPopupView的$onOpen接口
            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                sunui.M.viewLayer.onViewCreate(view, args);
                // 派发弹框创建完成事件
                if (args === void 0) {
                    this.facade.sendNotification(sunui.NotifyKey.ON_POPUP_CREATED, view);
                }
                else if (args instanceof Array) {
                    this.facade.sendNotification(sunui.NotifyKey.ON_POPUP_CREATED, [view].concat(args));
                }
                else {
                    this.facade.sendNotification(sunui.NotifyKey.ON_POPUP_CREATED, [view, args]);
                }
            }
            // 遮罩不通透逻辑处理
            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                var handler = suncom.Handler.create(this, this.$onPopupFinish, [view]);
                sunui.Tween.get(mask, suncore.ModuleEnum.CUSTOM).from({ alpha: 0 }, duration, null, handler);
            }
        };
        /**
         * 缓动结束
         */
        ShowPopupCommand.prototype.$onPopupFinish = function (view) {
            var info = sunui.M.viewLayer.getInfoByView(view);
            if (info !== null) {
                info.displayed = true;
                sunui.M.viewLayer.onViewOpen(view);
                this.facade.sendNotification(sunui.NotifyKey.ON_POPUP_OPENED, view);
            }
        };
        return ShowPopupCommand;
    }(sunui.AbstractPopupCommand));
    sunui.ShowPopupCommand = ShowPopupCommand;
})(sunui || (sunui = {}));
//# sourceMappingURL=ShowPopupCommand.js.map