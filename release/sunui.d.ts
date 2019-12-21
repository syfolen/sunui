/**
 * @license sunui (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the MIT License
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/sunui
 */
declare module sunui {

    enum UILevel {
        /**
         * 未设置
         */
        NONE = 0,

        /**
         * 背景
         */
        BACKGROUND,

        /**
         * 场景
         */
        SCENE,

        /**
         * 面板，可同时显示多个，且可同时操作多个，当前被操作的面板将置顶显示
         * TODO: 面板暂时是没有实现的，因为没有使用的地方
         */
        PANEL,

        /**
         * 飘浮对象
         */
        FLOAT,

        /**
         * 金币获得
         */
        GOLD_TIPS,

        /**
         * 高倍金币
         */
        HIGH_GOLD_TIPS,

        /**
         * 播报信息
         */
        NOTICE,

        /**
         * 大赢家
         */
        BIGWINNER,

        /**
         * 小游戏
         */
        MINI_GAME,

        /**
         * 通用类型，默认的弹出方式，可同时显示多个，但只允许操作最新弹出的视图
         */
        POPUP,

        /**
         * 异步框对象
         */
        WAITINGBOX,

        /**
         * 加载界面
         */
        LOADING,

        /**
         * 轻提示
         */
        TIPS,

        /**
         * 顶级弹出对象，特性与POPUP相同，一般情况下只适用于警告、错误等信息提示
         */
        TOP,

        /**
         * 测试对象，处在最顶层
         */
        DEBUG
    }

    /**
     * 弹框组件支持的接口
     */
    interface IPopupView {

        /**
         * 在弹框创建后调用
         */
        $onCreate?(...args: any[]): void;

        /**
         * 在弹框打开后调用，弹框将在弹出缓动完成之后被启用
         */
        $onOpen?(): void;

        /**
         * 在弹框被关闭前调用，弹框将在关闭缓动执行之前被禁用
         */
        $onClose?(): void;

        /**
         * 在弹框被移除前调用
         */
        $onRemove?(): void;
    }

    /**
     * 场景信息
     */
    interface ISceneInfo {
        /**
         * 场景名字
         */
        name: number;

        /**
         * 初始化类
         */
        iniCls?: new (data?: any) => suncore.ITask;

        /**
         * 反初始化类
         */
        uniCls?: new () => suncore.ITask;
    }

    /**
     * 缓动类
     */
    interface ITween {

        /**
         * 清除缓动
         */
        clear(): void;

        to(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;

        from(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;
    }

    /**
     * 弹出缓动信息接口，接口数据展示了执行弹出时支持的所有属性
     */
    interface IViewProps {
        /**
         * 坐标
         */
        x?: number;

        y?: number;

        /**
         * 缓动方法
         */
        ease?: Function;

        /**
         * 背景通透值
         */
        trans?: number;

        /**
         * 显示层级
         */
        level?: UILevel;

        /**
         * 是否允许取消
         */
        cancelAllowed?: boolean;

        /**
         * 弹框的左右自适应参数
         */
        left?: number;

        right?: number;

        /**
         * 弹框的上下自适应参数
         */
        top?: number;

        bottom?: number;

        /**
         * 弹框的居中自适应参数
         */
        centerX?: number;

        centerY?: number;

        /**
         * 弹出的变形系数
         */
        scaleX?: number;

        scaleY?: number;

        /**
         * 参数列表，此参数会通过IPopupView的$onOpen方法传入IPopupView，用于支持窗口之间的交互
         */
        args?: any;

        /**
         * 弹框关闭时是否保留节点，默认为false
         */
        keepNode?: boolean;
    }

    /**
     * 场景初始化抽象入口类
     */
    abstract class AbstractSceneIniClass extends suncore.AbstractTask {

        /**
         * 初始化执行函数，场景资源建议在此方法中加载
         */
        run(): boolean;

        /**
         * 进入场景回调，场景元素建议在此方法中初始化
         */
        protected $onEnterScene(): void;
    }

    /**
     * 注册场景信息
     */
    class RegisterScenesCommand extends puremvc.SimpleCommand {

        /**
         * @infos: 场景信息配置列表
         */
        execute(infos:Array<ISceneInfo>): void;
    }

    class Tween implements ITween {

        /**
         * @mod: 缓动挂靠的模块，默认为CUSTOM
         */
        static get(item:any, mod?:suncore.ModuleEnum): ITween;

        clear(): void;

        to(props:any, duration:number, ease?:Function, handler?:suncom.IHandler): ITween;

        from(props:any, duration:number, ease?:Function, handler?:suncom.IHandler): ITween;
    }

    class UIManager extends puremvc.Notifier {

        static getInstance(): UIManager;

        /**
         * 进入新场景，并将当前场景压入历史
         * @data: 参数对象，保存在此对象中的数据的生命周期与场景历史的生命周期一致，当场景存在于当前或存在于历史时，数据就不会被销毁
         */
        enterScene(name:number, data?:any): void;

        /**
         * 退出当前场景，并返回历史
         */
        exitScene(): void;

        /**
         * 替换当前场景
         * @data: 参数说明请参考enterScene方法的注释
         * 说明：被替换的场景不会进入历史
         */
        replaceScene(name:number, data?:any): void;

        /**
         * 获取场景对象
         */
        readonly uiScene: Laya.Scene;

        /**
         * 获取场景对象
         */
        readonly d3Scene: Laya.Scene3D;

        /**
         * 获取场景名字
         */
        readonly sceneName: number;
    }

    /**
     * 视图关系对象
     */
    class ViewContact extends puremvc.Notifier {

        /**
         * @caller: 脚本回调对象，允许为非弹框对象
         * @popup: 被监视的视图对象，只能为弹框对象
         */
        constructor(caller:any, popup:any);

        /**
         * 注册弹框被关闭时需要执行的回调
         */
        onPopupClosed(method:Function, caller:any): ViewContact;

        /**
         * 注册弹框被销毁时需要执行的回调
         */
        onPopupRemoved(method:Function, caller:any): ViewContact;
    }

    class ViewFacade extends puremvc.Notifier {
        /**
         * 设置是否允许取消，默认为false
         */
        cancelAllowed: boolean;

        /**
         * 弹出框外观
         * @view 弹出对象
         * @duration 缓动时间，默认为200毫秒
         */
        constructor(view:any, duration?:number);

        /**
         * 执行弹出逻辑
         */
        popup(props?:IViewProps): ViewFacade;

        /**
         * 执行关闭逻辑
         * @destroy: 关闭后是否销毁节点，默认为true
         */
        close(destroy?:boolean): void;
    }

    /**
     * 命令枚举
     */
    namespace NotifyKey {
        /**
         * 加载场景，此命令由外部注册并实现
         * 说明：
         * 1. 当场景加载完成时，外部应当派发ENTER_SCENE通知sunui以执行进入场景的逻辑
         */
        const LOAD_SCENE: string;

        /**
         * 卸载场景，此命令由外部注册并实现
         * 说明：
         * 1. 不同于LOAD_SCENE命令，当场景卸载完成时，外部无需派发EXIT_SCENE命令
         */
        const UNLOAD_SCENE: string;

        /**
         * 注册场景信息，此命令由sunui实现，但需要在外部进行注册
         */
        const REGISTER_SCENES: string;

        /**
         * 进入场景命令，由外部在实现LOAD_SCENE命令时于场景加载完成时派发
         * 说明：
         * 1. 此命令必然在iniCls被执行之后被派发
         */
        const ENTER_SCENE: string;

        /**
         * 退出场景命令，由sunui在执行退出场景逻辑时派发
         * 说明：
         * 1. 此命令必然在uniCls被执行之前被派发
         * 2. 场景退出与销毁并不相同，场景销毁的逻辑会执行在uniCls被执行之后
         */
        const EXIT_SCENE: string;

        /**
         * 弹框创建完成
         * 说明：
         * 1. 此事件会在IPopupView的$onCreate方法执行完毕之后被派发
         * 2. 传递给$onCreate方法的所有参数均会在此命令中被传递，同时弹框对象亦会被传递
         */
        const ON_POPUP_CREATED: string;

        /**
         * 弹框己打开
         * 说明：
         * 1. 此事件会在IPopupView的$onOpen方法执行完毕之后被派发
         */
        const ON_POPUP_OPENED: string;

        /**
         * 弹框己关闭
         * 说明：
         * 1. 此事件会在IPopupView的$onClose方法执行完毕之后被派发
         */
        const ON_POPUP_CLOSED: string;

        /**
         * 弹框销毁之前
         * 说明：
         * 1. 此事件会在IPopupView的$onRemove方法执行之前被派发
         */
        const BEFORE_POPUP_REMOVED: string;

        /**
         * 弹框己移除
         * 说明：
         * 1. 此事件会在IPopupView的$onRemove方法执行完毕之后被派发
         * 2. 为了避免不同对象之间的销毁逻辑相互形成干扰，此命令被派发时，意味着弹框对象己被销毁
         */
        const ON_POPUP_REMOVED: string;
    }

    /**
     * 资源管理器
     */
    namespace Resource {

        /**
         * 根据url创建对象
         * @method: 创建失败时res为null，仅支持Skeleton和Texture的创建
         * @flag: 目前仅用于代替aniMode的值（己弃用）
         * 说明：
         * 1. 调用此接口创建对象时，会产生一个计数，当计数为0时，资源会被彻底释放
         * 2. 见destroy方法
         */
        function create(url: string, method?: (res: any, url: string) => void, caller?: Object, flag?: number): any;

        /**
         * 销毁对象
         * 说明：
         * 1. 见create方法
         * 2. 调用此接口销毁对象时，会移除一个计数，当计数为0时，当计数为0时，资源会被彻底释放
         * 3. 若存在有部分逻辑未使用此接口加载资源，却调用此接口销毁资源，则可能会导致该资源被卸载或不可用，请注意
         */
        function destroy(url: string, method?: (res: any, url: string) => void, caller?: Object): void;

        /**
         * 资源预加载
         * @method: 预加载完成时，ok为true，id大于0，仅支持Skeleton和Texture
         * @return: 返回资源组ID
         */
        function prepare(urls: string[], method: (ok: boolean, id: number) => void, caller: Object): number;

        /**
         * 释放资源组
         * @id: 资源组ID
         * @return: 始终返回0
         */
        function release(id: number): number;
    }

    /**
     * 在对象或子对象中查找
     */
    function find(path:string, parent:Laya.Node): any;
}