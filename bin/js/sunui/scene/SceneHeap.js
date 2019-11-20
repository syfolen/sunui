var sunui;
(function (sunui) {
    /**
     * 场景历史管理器
     */
    var SceneHeap = /** @class */ (function () {
        function SceneHeap() {
        }
        SceneHeap.addHistory = function (name, args) {
            var info = {
                name: name,
                args: args
            };
            SceneHeap.$infos.push(info);
        };
        SceneHeap.removeHistory = function (name) {
            var index = SceneHeap.findHeapIndexByName(name);
            if (index > -1) {
                SceneHeap.$infos.splice(index, 1);
            }
            return index > -1;
        };
        SceneHeap.findHeapIndexByName = function (name) {
            for (var i = SceneHeap.$infos.length - 1; i > -1; i--) {
                var info = SceneHeap.$infos[i];
                if (info.name === name) {
                    return i;
                }
            }
            return -1;
        };
        SceneHeap.hasHistory = function (name) {
            return SceneHeap.findHeapIndexByName(name) > -1;
        };
        SceneHeap.pop = function () {
            if (SceneHeap.$infos.length > 0) {
                return SceneHeap.$infos[SceneHeap.$infos.length - 1];
            }
            return null;
        };
        SceneHeap.popByName = function (name) {
            var index = SceneHeap.findHeapIndexByName(name);
            if (index > -1) {
                return SceneHeap.$infos[index];
            }
            return null;
        };
        SceneHeap.$infos = [];
        return SceneHeap;
    }());
    sunui.SceneHeap = SceneHeap;
})(sunui || (sunui = {}));
//# sourceMappingURL=SceneHeap.js.map