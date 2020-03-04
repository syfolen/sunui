
module sunui {
    /**
     * 命令枚举
     * export
     */
    export namespace NotifyKey {
        /**
         * 加载场景 { info: ISceneInfo, data: any }
         * 说明：
         * 1. 此命令由外部注册并实现
         * 2. 当场景加载完成时，外部应当派发ENTER_SCENE以通知sunui继续逻辑
         * export
         */
        export const LOAD_SCENE: string = "sunui.NotifyKey.LOAD_SCENE";

        /**
         * 卸载场景 { info: ISceneInfo }
         * 说明：
         * 1. 此命令由外部注册并实现
         * 2. 不同于LOAD_SCENE命令，当场景卸载完成时，EXIT_SCENE命令不需要由外部派发
         * depends
         */
        export const UNLOAD_SCENE: string = "sunui.NotifyKey.UNLOAD_SCENE";

        /**
         * 注册场景信息 { infos: ISceneInfo[] }
         * 说明：
         * 1. 此命令由sunui实现，但需要在外部进行注册
         * export
         */
        export const REGISTER_SCENES: string = "sunui.NotifyKey.REGISTER_SCENES";

        /**
         * 进入场景命令 { uiScene: Laya.Scene, d3Scene: Laya.Scene3D }
         * 说明：
         * 1. 此命令由外部在实现LOAD_SCENE命令时于场景加载完成时派发
         * 2. 此命令必然在iniCls被执行之后被派发
         * export
         */
        export const ENTER_SCENE: string = "sunui.NotifyKey.ENTER_SCENE";

        /**
         * 退出场景命令 { sceneName: SceneNameEnum }
         * 说明：
         * 1. 此命令由sunui在执行退出场景逻辑时派发
         * 2. 此命令必然在uniCls被执行之前被派发
         * 3. 场景退出与销毁并不相同，场景销毁的逻辑会执行在uniCls被执行之后
         * 4. SceneNameEnum 为由外部定义的枚举值
         * depends
         */
        export const EXIT_SCENE: string = "sunui.NotifyKey.EXIT_SCENE";

        /**
         * 添加缓动对象 { tween: ITween }
         */
        export const ADD_TWEEN_OBJECT: string = "sunui.NotifyKey.ADD_TWEEN_OBJECT";

        /**
         * 显示弹框 { view: Laya.Sprite, duration: number, props: IViewProps, option: PopupMethodEnum | ITween }
         */
        export const SHOW_POPUP: string = "sunui.NotifyKey.SHOW_POPUP";

        /**
         * 关闭弹框 { view: Laya.Sprite, duration: number, destroy: boolean, option: PopupMethodEnum | ITween }
         */
        export const CLOSE_POPUP: string = "sunui.NotifyKey.CLOSE_POPUP";

        /**
         * 应用弹出效果 { view: Laya.Component, props: IViewProps, option: PopupMethodEnum | ITween, popup: boolean }
         * @popup: true为弹出，false为关闭
         */
        export const APPLY_POPUP_METHOD: string = "sunui.NotifyKey.APPLY_POPUP_METHOD";

        /**
         * 弹框创建完成 { view: Laya.Sprite, args?: any[] }
         * 说明：
         * 1. 此事件会在IPopupView的$onCreate方法执行完毕之后被派发
         * 2. 传递给$onCreate方法的所有参数均会在此命令中被传递，同时弹框对象亦会被传递
         * 补充：
         * 1. 接口己弃用，没有使用此接口的需求，另外事件的派发没有考虑在onCreate中直接关闭弹窗的情况
         */
        export const ON_POPUP_CREATED: string = "sunui.NotifyKey.ON_POPUP_CREATED";

        /**
         * 弹框己打开 { view: Laya.Sprite }
         * 说明：
         * 1. 此事件会在IPopupView的$onOpen方法执行完毕之后被派发
         * 补充：
         * 1. 接口己弃用，没有使用此接口的需求，另外事件的派发没有考虑在onOpen中直接关闭弹窗的情况
         */
        export const ON_POPUP_OPENED: string = "sunui.NotifyKey.ON_POPUP_OPENED";

        /**
         * 弹框己关闭 { view: Laya.Sprite }
         * 说明：
         * 1. 此事件会在IPopupView的$onClose方法执行完毕之后被派发
         * export
         */
        export const ON_POPUP_CLOSED: string = "sunui.NotifyKey.ON_POPUP_CLOSED";

        /**
         * 弹框移除之前 { view: Laya.Sprite }
         * 说明：
         * 1. 此事件会在IPopupView的$onRemove方法执行之前被派发
         * export
         */
        export const BEFORE_POPUP_REMOVE: string = "sunui.NotifyKey.BEFORE_POPUP_REMOVE";

        /**
         * 弹框己移除 { view: Laya.Sprite }
         * 说明：
         * 1. 此事件会在IPopupView的$onRemove方法执行完毕之后被派发
         * 2. 为了避免不同对象之间的销毁逻辑形成相互干扰，此命令被派发时，意味着弹框对象己被销毁
         * export
         */
        export const ON_POPUP_REMOVED: string = "sunui.NotifyKey.ON_POPUP_REMOVED";

        /**
         * 对象被销毁事件 { caller: any }
         * 说明：
         * 1. 此事件主要被设计用来避免与非弹框对象存在联系的弹框在对象被销毁时可能意外残留的问题
         * 2. 若某个非视图对象曾使用ViewContact与某个弹框建立过联系，则对象销毁时应当派发此事件
         * export
         */
        export const ON_CALLER_DESTROYED: string = "sunui.NotifyKey.ON_CALLER_DESTROYED";

        /**
         * 重试确认请求 { mod: suncore.ModuleEnum, prompt: string, options: IRetryOption[], handler: suncom.IHandler }
         * export
         */
        export const RETRY_CONFIRM: string = "sunui.NotifyKey.RETRY_CONFIRM";
    }
}