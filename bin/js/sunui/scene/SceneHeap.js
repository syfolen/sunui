var sunui;
(function (sunui) {
    /**
     * 场景历史管理器
     */
    var SceneHeap = /** @class */ (function () {
        function SceneHeap() {
        }
        SceneHeap.addHistory = function (name) {
            SceneHeap.$names.push(name);
        };
        SceneHeap.removeHistory = function (name) {
            var index = SceneHeap.$names.lastIndexOf(name);
            if (index < 0) {
                return false;
            }
            SceneHeap.$names.splice(index, 1);
            return true;
        };
        SceneHeap.hasHistory = function (name) {
            return SceneHeap.$names.indexOf(name) > -1;
        };
        SceneHeap.pop = function () {
            if (SceneHeap.$names.length > 0) {
                return SceneHeap.$names[SceneHeap.$names.length - 1];
            }
            return 0;
        };
        SceneHeap.popByName = function (name) {
            for (var i = SceneHeap.$names.length - 1; i > -1; i--) {
                if (SceneHeap.$names[i].sceneName == name) {
                    return name;
                }
            }
            return 0;
        };
        SceneHeap.$names = [];
        return SceneHeap;
    }());
    sunui.SceneHeap = SceneHeap;
})(sunui || (sunui = {}));
//# sourceMappingURL=SceneHeap.js.map