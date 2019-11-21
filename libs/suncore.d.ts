
declare module suncore {
    /**
     * 消息优先级
     */
    enum MessagePriorityEnum {
        /**
         * 网络消息
         * 说明：
         * 1. 网络消息以帧序号为批次，每帧会派发同一批次中的所有消息
         * 2. 为了防止被清除，网络消息始终会被添加到系统消息队列中
         * 3. 当系统被暂停时，网络消息不会被广播
         */
        PRIORITY_SOCKET,

        /**
         * 始终立即响应
         */
        PRIORITY_0,

        /**
         * 每帧至多响应十次消息
         */
        PRIORITY_HIGH,

        /**
         * 每帧至多响应三次的消息
         */
        PRIORITY_NOR,

        /**
         * 每帧至多响应一次的消息
         */
        PRIORITY_LOW,

        /**
         * 惰性消息
         * 说明：
         * 1. 当前帧若没有处理过任何消息，则会处理此类型的消息
         */
        PRIORITY_LAZY,

        /**
         * 基于消息列表的帧事件
         */
        PRIORITY_FRAME,

        /**
         * 触发器消息
         * 说明：
         * 1. 触发器在指定时刻必定会被触发
         * 2. 为了简化系统，同一个触发器只能被触发一次
         */
        PRIORITY_TRIGGER,

        /**
         * 任务消息
         * 说明：
         * 1. 任务消息会反复执行，直至任务完成
         * 2. 新的任务只会在下一帧被开始执行
         */
        PRIORITY_TASK,
    }

    /**
     * 模块枚举
     * 
     * 说明：
     * 由于游戏中的消息和定时器都是以队列的方式实现响应，所以在场景切换的过程中，就会涉及到未响应的元素的清理问题
     * 故设计了模块系统，队列将以模块来划分，当一个模块退出时，对应的列表将会被清理。
     * 
     * 注意：
     * 尽量不要添加新的模块，因为模块越多，消息响应的调度算法就会越复杂
     */
    enum ModuleEnum {
        /**
         * 系统模块
         * 此模块为常驻模块，该模块下的消息永远不会被清理
         */
        SYSTEM,

        /**
         * 通用模块
         * 此模块下的消息会在当前场景退出的同时被清理
         */
        CUSTOM,

        /**
         * 时间轴模块
         * 此模块下的消息会在时间轴被销毁的同时被清理
         */
        TIMELINE,
    }

    /**
     * 任务接口
     */
    interface ITask {
        /**
         * 任务是否己经完成
         */
        done: boolean;

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成
         */
        run(): boolean;
    }

    /**
     * 游戏时间轴接口
     */
    interface ITimeline {
        /**
         * 时间轴是否己暂停
         */
        readonly paused: boolean;

        /**
         * 时间轴是否己停止
         */
        readonly stopped: boolean;

        /**
         * 帧同步是否己开启
         */
        readonly lockStep: boolean;

        /**
         * 暂停时间轴
         * 1. 时间轴暂停时，对应的模块允许被添加任务
         */
        pause(): void;

        /**
         * 继续时间轴
         * @paused: 是否暂停时间轴，默认false
         */
        resume(paused?: boolean): void;

        /**
         * 停止时间轴
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        stop(): void;

        /**
         * 获取系统时间戳（毫秒）
         */
        getTime(): number;

        /**
         * 获取帧时间间隔（毫秒）
         */
        getDelta(): number;
    }

    /**
     * 系统时间戳接口
     */
    interface ITimeStamp extends ITimeline {
    }

    /**
     * 任务抽象类
     */
    abstract class AbstractTask extends puremvc.Notifier implements ITask {
        /**
         * 外部会访问此变量来判断任务是否己经完成
         */
        protected $done: boolean;

        /**
         * 任务是否己经完成
         */
        done: boolean;

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成，若返回false，则需要在其它函数中将done置为true，否则任务永远无法结束
         */
        abstract run(): boolean;
    }

    /**
     * 创建游戏时间轴
     */
    class CreateTimelineCommand extends puremvc.SimpleCommand {

        execute(): void;
    }

    /**
     * 网络消息派发器
     */
    abstract class MessageNotifier {

        /**
         * 通知网络消息
         */
        static notify(name:string, data:any): void;

        /**
         * 注册网络消息监听
         */
        static register(name:string, method:Function, caller:Object): void;

        /**
         * 移除网络消息监听
         */
        static unregister(name:string, method:Function, caller:Object): void;
    }

    /**
     * 命令枚举
     */
    abstract class NotifyKey {

        static readonly STARTUP: string;

        static readonly SHUTDOWN: string;

        static readonly PHYSICS_FRAME: string;

        static readonly PHYSICS_PREPARE: string;

        static readonly ENTER_FRAME: string;

        static readonly LATER_FRAME: string;

        static readonly CREATE_TIMELINE: string;

        static readonly REMOVE_TIMELINE: string;

        static readonly TIMELINE_STOPPED: string;

        static readonly TIMESTAMP_STOPPED: string;
    }

    /**
     * 移除游戏时间轴
     */
    class RemoveTimelineCommand extends puremvc.SimpleCommand {

        execute(): void;
    }

    /**
     * 简单任务对象
     */
    class SimpleTask extends AbstractTask {

        constructor(handler:suncom.IHandler);

        /**
         * 执行函数
         */
        run(): boolean;
    }

    abstract class System {
        /**
         * 游戏时间轴
         */
        static timeline: ITimeline;

        /**
         * 场景时间轴
         */
        static timeStamp: ITimeStamp;

        /**
         * 判断指定模块是否己停止
         */
        static isModuleStopped(mod:ModuleEnum): boolean;

        /**
         * 判断指定模块是否己暂停
         */
        static isModulePaused(mod:ModuleEnum): boolean;

        /**
         * 获取指定模块的时间戳
         */
        static getModuleTimestamp(mod:ModuleEnum): number;

        /**
         * 添加任务
         */
        static addTask(mod:ModuleEnum, task:ITask): void;

        /**
         * 添加触发器
         */
        static addTrigger(mod:ModuleEnum, delay:number, handler:suncom.IHandler): void;

        /**
         * 添加消息
         * @handler: 若为帧事件消息，则应当以Function作为参数，否则应当以Handler作为参数
         */
        static addMessage(mod:ModuleEnum, priority:MessagePriorityEnum, handler:suncom.IHandler | Function, caller?:Object): void;

        /**
         * 移除消息（目前移除的消息仅可能是帧消息）
         */
        static removeMessage(mod:ModuleEnum, priority:MessagePriorityEnum, handler:Function, caller?:Object): void;

        /**
         * 添加自定义定时器
         * @mod: 所属模块
         * @delay: 响应延时
         * @method: 回调函数
         * @caller: 回调对象
         * @loops: 响应次数
         */
        static addTimer(mod:ModuleEnum, delay:number, method:Function, caller:Object, loops?:number, real?:boolean): number;

        /**
         * 移除定时器
         */
        static removeTimer(timerId:number): number;
    }
}