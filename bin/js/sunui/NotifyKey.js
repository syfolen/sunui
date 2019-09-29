var sunui;
(function (sunui) {
    /**
     * 命令枚举
     */
    var NotifyKey = /** @class */ (function () {
        function NotifyKey() {
        }
        // 场景相关
        NotifyKey.LOAD_SCENE = "sunui.NotifyKey.LOAD_SCENE";
        NotifyKey.UNLOAD_SCENE = "sunui.NotifyKey.UNLOAD_SCENE";
        NotifyKey.REGISTER_SCENES = "sunui.NotifyKey.REGISTER_SCENES";
        NotifyKey.EXIT_SCENE = "sunui.NotifyKey.EXIT_SCENE";
        NotifyKey.ENTER_SCENE = "sunui.NotifyKey.ENTER_SCENE";
        // 弹框相关
        NotifyKey.SHOW_POPUP = "sunui.NotifyKey.SHOW_POPUP";
        NotifyKey.CLOSE_POPUP = "sunui.NotifyKey.CLOSE_POPUP";
        return NotifyKey;
    }());
    sunui.NotifyKey = NotifyKey;
})(sunui || (sunui = {}));
//# sourceMappingURL=NotifyKey.js.map