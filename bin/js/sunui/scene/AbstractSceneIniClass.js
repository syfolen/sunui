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
     * 场景初始化抽象入口类
     * export
     */
    var AbstractSceneIniClass = /** @class */ (function (_super) {
        __extends(AbstractSceneIniClass, _super);
        /**
         * 可为构造函数指定参数来实现场景间的数据传递
         */
        function AbstractSceneIniClass() {
            var _this = _super.call(this) || this;
            _this.facade.registerObserver(sunui.NotifyKey.ENTER_SCENE, _this.$onEnterScene, _this, true);
            return _this;
        }
        /**
         * 初始化执行函数，场景资源建议在此方法中加载
         * export
         */
        AbstractSceneIniClass.prototype.run = function () {
            return true;
        };
        /**
         * 进入场景回调，场景元素建议在此方法中初始化
         * export
         */
        AbstractSceneIniClass.prototype.$onEnterScene = function () {
        };
        return AbstractSceneIniClass;
    }(suncore.AbstractTask));
    sunui.AbstractSceneIniClass = AbstractSceneIniClass;
})(sunui || (sunui = {}));
//# sourceMappingURL=AbstractSceneIniClass.js.map