var sunui;
(function (sunui) {
    /**
     * 命令枚举
     * export
     */
    var NotifyKey;
    (function (NotifyKey) {
        /**
         * 加载场景，此命令由外部注册并实现
         * 说明：
         * 1. 当场景加载完成时，外部应当派发ENTER_SCENE通知sunui以执行进入场景的逻辑
         * export
         */
        NotifyKey.LOAD_SCENE = "sunui.NotifyKey.LOAD_SCENE";
        /**
         * 卸载场景，此命令由外部注册并实现
         * 说明：
         * 1. 不同于LOAD_SCENE命令，当场景卸载完成时，外部无需派发EXIT_SCENE命令
         * depends
         */
        NotifyKey.UNLOAD_SCENE = "sunui.NotifyKey.UNLOAD_SCENE";
        /**
         * 注册场景信息，此命令由sunui实现，但需要在外部进行注册
         * export
         */
        NotifyKey.REGISTER_SCENES = "sunui.NotifyKey.REGISTER_SCENES";
        /**
         * 进入场景命令，由外部在实现LOAD_SCENE命令时于场景加载完成时派发
         * 说明：
         * 1. 此命令必然在iniCls被执行之后被派发
         * export
         */
        NotifyKey.ENTER_SCENE = "sunui.NotifyKey.ENTER_SCENE";
        /**
         * 退出场景命令，由sunui在执行退出场景逻辑时派发
         * 说明：
         * 1. 此命令必然在uniCls被执行之前被派发
         * 2. 场景退出与销毁并不相同，场景销毁的逻辑会执行在uniCls被执行之后
         * depends
         */
        NotifyKey.EXIT_SCENE = "sunui.NotifyKey.EXIT_SCENE";
        /**
         * 显示弹框
         */
        NotifyKey.SHOW_POPUP = "sunui.NotifyKey.SHOW_POPUP";
        /**
         * 关闭弹框
         */
        NotifyKey.CLOSE_POPUP = "sunui.NotifyKey.CLOSE_POPUP";
        /**
         * 弹框创建完成
         * 说明：
         * 1. 此事件会在IPopupView的$onCreate方法执行完毕之后被派发
         * 2. 传递给$onCreate方法的所有参数均会在此命令中被传递，同时弹框对象亦会被传递
         * export
         */
        NotifyKey.ON_POPUP_CREATED = "sunui.NotifyKey.ON_POPUP_CREATED";
        /**
         * 弹框己打开
         * 说明：
         * 1. 此事件会在IPopupView的$onOpen方法执行完毕之后被派发
         * export
         */
        NotifyKey.ON_POPUP_OPENED = "sunui.NotifyKey.ON_POPUP_OPENED";
        /**
         * 弹框己关闭
         * 说明：
         * 1. 此事件会在IPopupView的$onClose方法执行完毕之后被派发
         * export
         */
        NotifyKey.ON_POPUP_CLOSED = "sunui.NotifyKey.ON_POPUP_CLOSED";
        /**
         * 弹框己移除
         * 说明：
         * 1. 此事件会在IPopupView的$onRemove方法执行完毕之后被派发
         * 2. 为了避免不同对象之间的销毁逻辑相互形成干扰，此命令被派发时，意味着弹框对象己被销毁
         * export
         */
        NotifyKey.ON_POPUP_REMOVED = "sunui.NotifyKey.ON_POPUP_REMOVED";
    })(NotifyKey = sunui.NotifyKey || (sunui.NotifyKey = {}));
})(sunui || (sunui = {}));
//# sourceMappingURL=NotifyKey.js.map