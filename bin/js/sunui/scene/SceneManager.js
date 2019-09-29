var sunui;
(function (sunui) {
    /**
     * 场景配置信息
     */
    var SceneManager = /** @class */ (function () {
        function SceneManager() {
        }
        /**
         * 注册场景
         */
        SceneManager.regScene = function (info) {
            for (var i = 0; i < SceneManager.$infos.length; i++) {
                if (SceneManager.$infos[i].name === info.name) {
                    throw Error("重复注册场景");
                }
            }
            SceneManager.$infos.push(info);
        };
        /**
         * 获取场景配置
         */
        SceneManager.getConfigByName = function (name) {
            for (var i = 0; i < SceneManager.$infos.length; i++) {
                var info = SceneManager.$infos[i];
                if (info.name === name) {
                    return info;
                }
            }
            throw Error("场景配置不存在");
        };
        SceneManager.$infos = [];
        return SceneManager;
    }());
    sunui.SceneManager = SceneManager;
})(sunui || (sunui = {}));
//# sourceMappingURL=SceneManager.js.map