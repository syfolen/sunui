var sunui;
(function (sunui) {
    /**
     * 在对象或子对象中查找
     * export
     */
    function find(path, parent) {
        var array = path.split("/");
        while (parent != null && array.length > 0) {
            var name_1 = array.shift();
            parent = parent.getChildByName(name_1);
        }
        return parent;
    }
    sunui.find = find;
})(sunui || (sunui = {}));
//# sourceMappingURL=func.js.map