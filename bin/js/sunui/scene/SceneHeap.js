var sunui;
(function (sunui) {
    /**
     * 场景历史栈
     */
    var SceneHeap;
    (function (SceneHeap) {
        /**
         * 历史场景信息列表
         */
        var $infos = [];
        /**
         * 根据场景名字获取信息索引
         */
        function findHeapIndexByName(name) {
            for (var i = $infos.length - 1; i > -1; i--) {
                if ($infos[i].name === name) {
                    return i;
                }
            }
            return -1;
        }
        /**
         * 添加历史
         * @args: 参数列表，允许为任意类型
         */
        function addHistory(name, args) {
            var info = {
                name: name,
                args: args
            };
            $infos.push(info);
        }
        SceneHeap.addHistory = addHistory;
        /**
         * 移除历史
         */
        function removeHistory(name) {
            var index = findHeapIndexByName(name);
            if (index > -1) {
                $infos.splice(index, 1);
            }
            return index > -1;
        }
        SceneHeap.removeHistory = removeHistory;
        /**
         * 是否存在指定历史
         */
        function hasHistory(name) {
            return findHeapIndexByName(name) > -1;
        }
        SceneHeap.hasHistory = hasHistory;
        /**
         * 返回上一个历史场景信息
         */
        function pop() {
            if ($infos.length > 0) {
                return $infos[$infos.length - 1];
            }
            return null;
        }
        SceneHeap.pop = pop;
        /**
         * 根据名字返回历史场景信息
         */
        function popByName(name) {
            var index = findHeapIndexByName(name);
            if (index > -1) {
                return $infos[index];
            }
            return null;
        }
        SceneHeap.popByName = popByName;
    })(SceneHeap = sunui.SceneHeap || (sunui.SceneHeap = {}));
})(sunui || (sunui = {}));
//# sourceMappingURL=SceneHeap.js.map