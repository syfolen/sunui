var sunui;
(function (sunui) {
    var ViewLayer = /** @class */ (function () {
        function ViewLayer() {
            /**
             * 视图栈信息
             */
            this.$infos = [];
            // 监听场景被卸载消息，此消息应当优先被响应
            puremvc.Facade.getInstance().registerObserver(sunui.NotifyKey.UNLOAD_SCENE, this.$onUnloadScene, this, false, 5);
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
         * 是否存在TOP类型的视图
         */
        ViewLayer.prototype.hasTopView = function () {
            var info = this.getActiveViewInfo();
            if (info != null && info.level == sunui.UILevel.TOP) {
                return true;
            }
            return false;
        };
        /**
         * 根据视图获取弹出信息
         */
        ViewLayer.prototype.getInfoByView = function (view) {
            for (var i = this.$infos.length - 1; i > -1; i--) {
                var info = this.$infos[i];
                if (info.view == view) {
                    return info;
                }
            }
            return null;
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
         * 获取上一个背景不通透的节点
         */
        ViewLayer.prototype.returnLatestStackNotTrans = function (view) {
            for (var i = this.$infos.length - 1; i > -1; i--) {
                var info = this.$infos[i];
                if (info.view == view || info.trans == true) {
                    continue;
                }
                return info;
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
         * 根据视图信息直接移除视图
         */
        ViewLayer.prototype.removeStackByInfo = function (info) {
            var index = this.$infos.indexOf(info);
            if (index < 0) {
                return;
            }
            this.$infos.splice(index, 1);
            var popup = info.view;
            popup.$onRemove && popup.$onRemove();
            this.removeChild(info.mask);
            this.removeChild(info.view);
            if (info.keepNode == false) {
                this.destroyView(info.view);
            }
            // 若被移除的弹框背景不为通透，则需要找一个不通透的节点，将背景置为不通透
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
                if (viewClass !== void 0) {
                    if (info.viewClass == viewClass) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
            return false;
        };
        /**
         * 显示新视图，若需要，则隐藏当前视图
         * @viewClass: 视图类型
         * @args: 参数列表
         * @props: 视图属性
         */
        ViewLayer.prototype.showView = function (viewClass, args, props) {
            if (props === void 0) { props = {}; }
            // 修正参数
            if (props.cancelAllowed === void 0) {
                props.cancelAllowed = true;
            }
            var trans = props.trans;
            var cancelAllowed = props.cancelAllowed;
            delete props.trans;
            delete props.cancelAllowed;
            // 创建视图
            var view = this.createViewByClass(viewClass);
            // 补充属性
            props.args = args;
            props.keepNode = false;
            props.viewClass = viewClass;
            // 执行弹出逻辑
            new sunui.ViewFacade(view).popup(trans, props).cancelAllowed = cancelAllowed;
            return view;
        };
        /**
         * 关闭当前视图，并显示上一个视图
         */
        ViewLayer.prototype.closeView = function (view) {
            new sunui.ViewFacade(view).close();
        };
        /**
         * 根据提示内容来搜索提示框视图对象
         */
        ViewLayer.prototype.searchPopupViewByMessage = function (message) {
            for (var i = this.$infos.length - 1; i > -1; i--) {
                var info = this.$infos[i];
                // 必须是通用提示框类型
                if (info.view instanceof sunui.UIManager.getInstance().baseViewClass) {
                }
            }
            return null;
        };
        Object.defineProperty(ViewLayer.prototype, "isCurrentViewCancelAllowed", {
            /**
             * 判断当前视图是否允许取消
             */
            get: function () {
                var info = this.getActiveViewInfo();
                if (info != null && info.cancelAllowed == true) {
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        return ViewLayer;
    }());
    sunui.ViewLayer = ViewLayer;
})(sunui || (sunui = {}));
//# sourceMappingURL=ViewLayer.js.map