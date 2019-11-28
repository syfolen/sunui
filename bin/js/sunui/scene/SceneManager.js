var sunui;
(function (sunui) {
    /**
     * 场景配置信息
     */
    var SceneManager;
    (function (SceneManager) {
        /**
         * 场景配置信息列表
         */
        var $infos = [];
        /**
         * 注册场景
         */
        function regScene(info) {
            for (var i = 0; i < $infos.length; i++) {
                if ($infos[i].name === info.name) {
                    throw Error("重复注册场景");
                }
            }
            $infos.push(info);
        }
        SceneManager.regScene = regScene;
        /**
         * 根据名字获取配置
         */
        function getConfigByName(name) {
            for (var i = 0; i < $infos.length; i++) {
                var info = $infos[i];
                if (info.name === name) {
                    return info;
                }
            }
            throw Error("场景配置不存在");
        }
        SceneManager.getConfigByName = getConfigByName;
    })(SceneManager = sunui.SceneManager || (sunui.SceneManager = {}));
})(sunui || (sunui = {}));
//# sourceMappingURL=SceneManager.js.map