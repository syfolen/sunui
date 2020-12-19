
module sunui {
    /**
     * 命令枚举
     * export
     */
    export namespace NotifyKey {
        /**
         * 重试确认请求 { mod: suncore.ModuleEnum, prompt: string, options: IRetryOption[], handler: suncom.IHandler }
         * export
         */
        export const RETRY_CONFIRM: string = "sunui.NotifyKey.RETRY_CONFIRM";

        /**
         * 注册场景信息 { infos: ISceneInfo[] }
         * 说明：
         * 1. 此命令由sunui实现，但需要在外部进行注册
         * export
         */
        export const REGISTER_SCENES: string = "sunui.NotifyKey.REGISTER_SCENES";

        /**
         * 加载场景之前 { none }
         * 说明：
         * 1. 此事件主要用于展示LoadingView
         * export
         */
        export const BEFORE_LOAD_SCENE: string = "sunui.NotifyKey.BEFORE_LOAD_SCENE";

        /**
         * 加载场景 { info: ISceneInfo }
         * 说明：
         * 1. 此命令由外部注册并实现
         * 2. 当场景加载完成时，外部应当派发ENTER_SCENE命令以通知sunui继续逻辑
         * export
         */
        export const LOAD_SCENE: string = "sunui.NotifyKey.LOAD_SCENE";

        /**
         * 卸载场景 { scene2d: Laya.Scene, scene3d: Laya.Scene3D }
         * 说明：
         * 1. 此命令由外部注册并实现
         * 2. 不同于LOAD_SCENE命令，当场景卸载完成时，EXIT_SCENE命令不需要由外部派发
         * depends
         */
        export const UNLOAD_SCENE: string = "sunui.NotifyKey.UNLOAD_SCENE";

        /**
         * 进入场景命令 { scene2d: Laya.Scene, scene3d: Laya.Scene3D }
         * 说明：
         * 1. sunui优先响应此命令
         * 2. 此命令由外部在实现LOAD_SCENE命令时于场景加载完成时派发
         * 3. 此命令必然在iniCls.run()被执行之后被派发
         * export
         */
        export const ENTER_SCENE: string = "sunui.NotifyKey.ENTER_SCENE";

        /**
         * 退出场景命令 { sceneName: SceneNameEnum }
         * 说明：
         * 1. 此命令被派发时，意味着退出场景的逻辑即将被执行
         * 2. 场景时间轴将此命令被派发后自动停止，sunui开始进入退出与销毁场景的流程
         * 3. SceneNameEnum 为由外部定义的枚举值
         * depends
         */
        export const EXIT_SCENE: string = "sunui.NotifyKey.EXIT_SCENE";

        /**
         * 离开场景命令 { none }
         * 说明：
         * 1. 此命令在完成uniCls的构建之后被派发（此时uniCls.run尚未执行）
         * 2. 表现层中的数据应当在此处销毁
         * depends
         */
        export const LEAVE_SCENE: string = "sunui.NotifyKey.LEAVE_SCENE";

        /**
         * 显示弹框 { view: IView, duration: number, props: IViewProps }
         */
        export const SHOW_POPUP: string = "sunui.NotifyKey.SHOW_POPUP";

        /**
         * 关闭弹框 { view: IView, duration: number, destroy: boolean }
         */
        export const CLOSE_POPUP: string = "sunui.NotifyKey.CLOSE_POPUP";

        /**
         * 弹框己关闭 { view: Laya.Sprite }
         * 说明：
         * 1. 此事件会在IPopupView的$onClose方法执行完毕之后被派发
         */
        export const ON_POPUP_CLOSED: string = "sunui.NotifyKey.ON_POPUP_CLOSED";

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
         * 资源加载失败 { none }
         */
        export const ON_ASSET_SAFETY_LOADER_FAILED: string = "sunui.NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED";

        /**
         * UrlSafetyLoader对象创建通知 { loader: UrlSafetyLoader }
         */
        export const ON_URL_SAFETY_LOADER_CREATED: string = "sunui.NotifyKey.ON_URL_SAFETY_LOADER_CREATED";

        /**
         * UrlSafetyLoader加载完成通知 { loader: UrlSafetyLoader }
         */
        export const ON_URL_SAFETY_LOADER_COMPLETE: string = "sunui.NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE";

        /**
         * 资源加载重试 { none }
         */
        export const ASSET_SAFETY_LOADER_RETRY: string = "sunui.NotifyKey.ASSET_SAFETY_LOADER_RETRY";

        /**
         * 注册缓动对象 { tween: ITween }
         */
        export const REGISTER_TWEEN_OBJECT: string = "sunui.NotifyKey.REGISTER_TWEEN_OBJECT";

        /**
         * 解锁下一个逻辑命令 { command: LogicCommand }
         */
        export const NEXT_LOGIC_COMMAND: string = "sunui.NotifyKey.NEXT_LOGIC_COMMAND";

        /**
         * 依赖命令己解锁
         */
        export const ON_INTERCEPTOR_RELIEVED: string = "sunui.NotifyKey.ON_INTERCEPTOR_RELIEVED";

        /**
         * 销毁逻辑命令 { hashId: number }
         * export
         */
        export const DESTROY_LOGIC_RUNNABLE: string = "sunui.NotifyKey.DESTROY_LOGIC_RUNNABLE";

        /**
         * 销毁所有逻辑命令
         */
        export const DESTROY_ALL_LOGIC_RUNNABLE: string = "sunui.NotifyKey.DESTROY_ALL_LOGIC_RUNNABLE";
    }
}