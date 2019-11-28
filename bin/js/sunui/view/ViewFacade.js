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
    var ViewFacade = /** @class */ (function (_super) {
        __extends(ViewFacade, _super);
        /**
         * 弹出框外观
         * @view 弹出对象
         * @duration 缓动时间，默认为200毫秒
         * export
         */
        function ViewFacade(view, duration) {
            var _this = _super.call(this) || this;
            /**
             * 弹出信息配置
             */
            _this.$info = null;
            _this.$view = view;
            // 若存在配置
            if (_this.info) {
                _this.$duration = _this.info.duration;
            }
            // 若缓动时间未设置，则使用默认值
            else if (duration === void 0) {
                _this.$duration = 200;
            }
            else {
                _this.$duration = duration;
            }
            return _this;
        }
        /**
         * 执行弹出逻辑
         * export
         */
        ViewFacade.prototype.popup = function (props) {
            if (props === void 0) { props = {}; }
            if (this.facade.hasCommand(sunui.NotifyKey.SHOW_POPUP) == true) {
                this.facade.sendNotification(sunui.NotifyKey.SHOW_POPUP, [this.$view, this.$duration, props]);
            }
            return this;
        };
        /**
         * 执行关闭逻辑
         * @destroy: 关闭后是否销毁节点，默认为true
         * export
         */
        ViewFacade.prototype.close = function (destroy) {
            if (this.facade.hasCommand(sunui.NotifyKey.CLOSE_POPUP) == true) {
                this.facade.sendNotification(sunui.NotifyKey.CLOSE_POPUP, [this.$view, this.$duration, destroy]);
            }
        };
        Object.defineProperty(ViewFacade.prototype, "cancelAllowed", {
            /**
             * 设置是否允许取消，默认为false
             * export
             */
            get: function () {
                return this.info.cancelAllowed;
            },
            /**
             * depends
             */
            set: function (yes) {
                this.info.cancelAllowed = yes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewFacade.prototype, "info", {
            /**
             * 获取配置信息
             */
            get: function () {
                if (this.$info == null) {
                    this.$info = sunui.M.viewLayer.getInfoByView(this.$view);
                }
                return this.$info;
            },
            enumerable: true,
            configurable: true
        });
        return ViewFacade;
    }(puremvc.Notifier));
    sunui.ViewFacade = ViewFacade;
})(sunui || (sunui = {}));
//# sourceMappingURL=ViewFacade.js.map