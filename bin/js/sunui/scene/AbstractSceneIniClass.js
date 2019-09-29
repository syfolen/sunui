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
     */
    var AbstractSceneIniClass = /** @class */ (function (_super) {
        __extends(AbstractSceneIniClass, _super);
        function AbstractSceneIniClass() {
            var _this = _super.call(this) || this;
            puremvc.Facade.getInstance().registerObserver(sunui.NotifyKey.ENTER_SCENE, _this.$onEnterScene, _this, true);
            return _this;
        }
        AbstractSceneIniClass.prototype.run = function () {
            return true;
        };
        /**
         * 接收到进入场景通知
         */
        AbstractSceneIniClass.prototype.$onEnterScene = function () {
        };
        return AbstractSceneIniClass;
    }(suncore.AbstractTask));
    sunui.AbstractSceneIniClass = AbstractSceneIniClass;
})(sunui || (sunui = {}));
//# sourceMappingURL=AbstractSceneIniClass.js.map