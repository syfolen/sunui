
module sunui {
    /**
     * 命令枚举
     * export
     */
    export namespace NotifyKey {
        /**
         * 加载场景，此命令由外部注册并实现
         * 说明：
         * 1. 当场景加载完成时，外部应当派发ENTER_SCENE通知sunui以执行进入场景的逻辑
         * export
         */
        export const LOAD_SCENE: string = "sunui.NotifyKey.LOAD_SCENE";

        /**
         * 卸载场景，此命令由外部注册并实现
         * 说明：
         * 1. 不同于LOAD_SCENE命令，当场景卸载完成时，外部无需派发EXIT_SCENE命令
         * depends
         */
        export const UNLOAD_SCENE: string = "sunui.NotifyKey.UNLOAD_SCENE";

        /**
         * 注册场景信息，此命令由sunui实现，但需要在外部进行注册
         * export
         */
        export const REGISTER_SCENES: string = "sunui.NotifyKey.REGISTER_SCENES";

        /**
         * 进入场景命令，由外部在实现LOAD_SCENE命令时于场景加载完成时派发
         * 说明：
         * 1. 此命令必然在iniCls被执行之后被派发
         * export
         */
        export const ENTER_SCENE: string = "sunui.NotifyKey.ENTER_SCENE";

        /**
         * 退出场景命令，由sunui在执行退出场景逻辑时派发
         * 说明：
         * 1. 此命令必然在uniCls被执行之前被派发
         * 2. 场景退出与销毁并不相同，场景销毁的逻辑会执行在uniCls被执行之后
         * depends
         */
        export const EXIT_SCENE: string = "sunui.NotifyKey.EXIT_SCENE";

        /**
         * 显示弹框
         */
        export const SHOW_POPUP: string = "sunui.NotifyKey.SHOW_POPUP";

        /**
         * 关闭弹框
         */
        export const CLOSE_POPUP: string = "sunui.NotifyKey.CLOSE_POPUP";

        /**
         * 弹框创建完成
         * 说明：
         * 1. 此事件会在IPopupView的$onCreate方法执行完毕之后被派发
         * 2. 传递给$onCreate方法的所有参数均会在此命令中被传递，同时弹框对象亦会被传递
         * export
         */
        export const ON_POPUP_CREATED: string = "sunui.NotifyKey.ON_POPUP_CREATED";

        /**
         * 弹框己打开
         * 说明：
         * 1. 此事件会在IPopupView的$onOpen方法执行完毕之后被派发
         * export
         */
        export const ON_POPUP_OPENED: string = "sunui.NotifyKey.ON_POPUP_OPENED";

        /**
         * 弹框己关闭
         * 说明：
         * 1. 此事件会在IPopupView的$onClose方法执行完毕之后被派发
         * export
         */
        export const ON_POPUP_CLOSED: string = "sunui.NotifyKey.ON_POPUP_CLOSED";

        /**
         * 弹框己移除
         * 说明：
         * 1. 此事件会在IPopupView的$onRemove方法执行完毕之后被派发
         * 2. 为了避免不同对象之间的销毁逻辑相互形成干扰，此命令被派发时，意味着弹框对象己被销毁
         * export
         */
        export const ON_POPUP_REMOVED: string = "sunui.NotifyKey.ON_POPUP_REMOVED";

        /**
         * 视图被销毁事件
         * 说明：
         * 1. 若某个非弹出视图曾使用ViewContact与某个弹框建立过联系，则对象销毁时应当派发此事件
         */
        export const ON_CALLER_DESTROYED: string = "sunui.NotifyKey.ON_CALLER_DESTROYED";
    }
}