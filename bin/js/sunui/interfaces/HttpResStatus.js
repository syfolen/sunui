var sunui;
(function (sunui) {
    /**
     * Http请求结果状态
     */
    var HttpResStatus;
    (function (HttpResStatus) {
        /**
         * 正常
         */
        HttpResStatus[HttpResStatus["OK"] = 0] = "OK";
        /**
         * 读取结果出错
         */
        HttpResStatus[HttpResStatus["IO_ERROR"] = -1] = "IO_ERROR";
        /**
         * 解析结果出错
         */
        HttpResStatus[HttpResStatus["PARSE_ERROR"] = -2] = "PARSE_ERROR";
    })(HttpResStatus = sunui.HttpResStatus || (sunui.HttpResStatus = {}));
})(sunui || (sunui = {}));
//# sourceMappingURL=HttpResStatus.js.map