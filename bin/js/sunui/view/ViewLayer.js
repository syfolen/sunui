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
     * 视图层抽象类
     * export
     */
    var ViewLayer = /** @class */ (function (_super) {
        __extends(ViewLayer, _super);
        function ViewLayer() {
            var _this = _super.call(this) || this;
            /**
             * 视图栈信息
             */
            _this.$infos = [];
            // 监听场景被卸载消息，此消息最后被响应
            _this.facade.registerObserver(sunui.NotifyKey.UNLOAD_SCENE, _this.$onUnloadScene, _this, false, 0);
            return _this;
        }
        /**
         * 场景被卸载时，应当移除所有视图
         */
        ViewLayer.prototype.$onUnloadScene = function () {
            var array = this.$infos.concat();
            while (array.length > 0) {
                this.removeStackByInfo(array.pop());
            }
        };
        /**
         * 根据视图信息直接移除视图
         */
        ViewLayer.prototype.removeStackByInfo = function (info) {
            var index = this.$infos.indexOf(info);
            if (index < 0) {
                return;
            }
            this.$infos.splice(index, 1);
            this.onViewRemove(info.view);
            this.removeChild(info.view);
            this.removeChild(info.mask);
            if (info.keepNode == false) {
                this.destroyView(info.view);
            }
        };
        /**
         * 判断是否存在指定层级的视图
         */
        ViewLayer.prototype.isViewExistInLevel = function (level) {
            for (var i = 0; i < this.$infos.length; i++) {
                var info = this.$infos[i];
                if (info.closed === false && info.level === level) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 获取当前第一个活动的视图信息
         */
        ViewLayer.prototype.getActiveViewInfo = function () {
            for (var i = this.$infos.length - 1; i > -1; i--) {
                var info = this.$infos[i];
                if (info.closed == false) {
                    return info;
                }
            }
            return null;
        };
        /**
         * 根据视图获取弹出信息
         */
        ViewLayer.prototype.getInfoByView = function (view) {
            for (var i = this.$infos.length - 1; i > -1; i--) {
                var info = this.$infos[i];
                if (info.view === view) {
                    return info;
                }
            }
            return null;
        };
        /**
         * 将视图信息保存至视图栈中
         * NOTE: 保存时应当按UILevel从小到大的顺序排列，同级别的，后来的先处理
         */
        ViewLayer.prototype.addStack = function (newInfo) {
            var index = -1;
            for (var i = 0; i < this.$infos.length; i++) {
                var info = this.$infos[i];
                if (index == -1 && info.level > newInfo.level) {
                    index = i;
                    break;
                }
            }
            if (index == -1) {
                this.$infos.push(newInfo);
            }
            else {
                this.$infos.splice(index, 0, newInfo);
            }
        };
        /**
         * 根据视图对象移除视图信息
         */
        ViewLayer.prototype.removeStackByView = function (view) {
            for (var i = this.$infos.length - 1; i > -1; i--) {
                var info = this.$infos[i];
                if (info.view == view) {
                    this.removeStackByInfo(info);
                    break;
                }
            }
        };
        /**
         * 根据视图类型移除视图
         */
        ViewLayer.prototype.removeStackByViewClass = function (viewClass) {
            var array = [];
            for (var i = 0; i < this.$infos.length; i++) {
                var info = this.$infos[i];
                if (info.viewClass == viewClass) {
                    array.push(info);
                }
            }
            while (array.length > 0) {
                this.removeStackByInfo(array.pop());
            }
        };
        /**
         * 是否存在指定类型的视图
         * @viewClass: 视图类型
         * NOTE: 若参数为空，则返回是否存在弹出视图
         */
        ViewLayer.prototype.hasView = function (viewClass) {
            for (var i = 0; i < this.$infos.length; i++) {
                var info = this.$infos[i];
                // 忽略己关闭的弹框
                if (info.closed == true) {
                    continue;
                }
                if (info.viewClass === viewClass) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 显示新视图
         * @viewClass: 视图类型，允许为string或new ()=> IView 类型
         * @args: 参数列表
         * @props: 视图属性
         */
        ViewLayer.prototype.showView = function (viewClass, args, props) {
            if (props === void 0) { props = {}; }
            // 修正参数
            if (props.cancelAllowed === void 0) {
                props.cancelAllowed = true;
            }
            var cancelAllowed = props.cancelAllowed;
            delete props.cancelAllowed;
            // 创建视图
            var view = this.createViewByClass(viewClass);
            // 补充属性
            props.args = args;
            props.keepNode = false;
            props.viewClass = viewClass;
            // 执行弹出逻辑
            new sunui.ViewFacade(view).popup(props).cancelAllowed = cancelAllowed;
            return view;
        };
        /**
         * 关闭当前视图
         */
        ViewLayer.prototype.closeView = function (view) {
            new sunui.ViewFacade(view).close();
        };
        Object.defineProperty(ViewLayer.prototype, "isCurrentViewCancelAllowed", {
            /**
             * 判断当前视图是否允许取消
             */
            get: function () {
                var info = this.getActiveViewInfo();
                if (info != null && info.cancelAllowed === true) {
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        return ViewLayer;
    }(puremvc.Notifier));
    sunui.ViewLayer = ViewLayer;
})(sunui || (sunui = {}));
//# sourceMappingURL=ViewLayer.js.map