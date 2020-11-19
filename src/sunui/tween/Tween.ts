
module sunui {
    /**
     * 缓动类
     * export
     */
    export class Tween extends puremvc.Notifier {
        /**
         * 执行缓动的模块
         */
        private $mod: suncore.ModuleEnum = suncore.ModuleEnum.SYSTEM;

        /**
         * 缓动对象
         */
        private $item: any = null;

        /**
         * 缓动信息列表
         */
        private $infos: ITweenInfo[] = [];

        /**
         * 最终属性（连续缓动时使用）
         */
        private $props: { [name: string]: number } = null;

        /**
         * 是否使用对象池
         */
        private $usePool: boolean = false;

        constructor(item: any, mod: suncore.ModuleEnum) {
            super();
            this.$mod = mod;
            this.$item = item;
            if (suncore.System.isModuleStopped(mod) === false) {
                this.facade.sendNotification(NotifyKey.REGISTER_TWEEN_OBJECT, this);
            }
            else {
                suncom.Logger.error(suncom.DebugMode.ANY, `尝试添加缓动，但时间轴己停止，mod:${suncore.ModuleEnum[mod]}`);
            }
        }

        /**
         * 取消缓动
         * export
         */
        cancel(): Tween {
            this.$props = null;
            this.$infos.length = 0;
            return this;
        }

        /**
         * 回收到对象池
         * export
         */
        recover(): void {
            this.$usePool = true;
            this.cancel();
        }

        /**
         * 从当前属性缓动至props属性
         * @props: 变化的属性集合，其中update属性的类型只能指定为suncom.Handler，可用其来观察缓动数值的变化
         * @duration: 缓动时长
         * @ease: 缓动函数，默认为: null
         * @complete: 缓动结束时的回调，默认为: null
         * export
         */
        to(props: any, duration: number, ease: Function = null, complete: suncom.Handler = null): Tween {
            const keys: string[] = Object.keys(props);
            const item: any = this.$props === null ? this.$item : this.$props;
            this.$createTweenInfo(keys, item, props, duration, ease, props.update || null, complete);
            return this;
        }

        /**
         * 从props属性缓动至当前属性
         * @参数详细说明请参考Tween.to
         * export
         */
        from(props: any, duration: number, ease: Function = null, complete: suncom.Handler = null): Tween {
            const keys: string[] = Object.keys(props);
            const item: any = this.$props === null ? this.$item : this.$props;
            this.$createTweenInfo(keys, props, item, duration, ease, props.update || null, complete);
            return this;
        }

        /**
         * 以props属性的幅度进行缓动
         * @参数详细说明请参考Tween.to
         * export
         */
        by(props: any, duration: number, ease: Function = null, complete: suncom.IHandler = null): Tween {
            const keys: string[] = Object.keys(props);
            const item: any = this.$props === null ? this.$item : this.$props;
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[i];
                if (this.$props === null || this.$props[key] === void 0) {
                    props[key] += this.$item[key];
                }
                else {
                    props[key] += item[key];
                }
            }
            this.to(props, duration, ease, complete);
            return this;
        }

        /**
         * 生成缓动信息
         */
        private $createTweenInfo(keys: string[], from: any, to: any, duration: number, ease: Function, update: suncom.IHandler, complete: suncom.IHandler): void {
            // 最终属性
            this.$props = this.$props || {};

            // 动作列表
            const actions: ITweenAction[] = [];
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[i];
                if (key === "update") {
                    continue;
                }
                const action: ITweenAction = {
                    prop: key,
                    from: from[key],
                    to: to[key]
                };
                if (action.from === void 0) {
                    action.from = this.$item[key];
                }
                actions.push(action);
                // 更新最终属性，用来支持连续缓动的实现
                this.$props[key] = to[key];
                // 第一次执行from缓动时会有点问题
                if (this.$infos.length === 0) {
                    this.$item[action.prop] = action.from;
                }
            }

            const info: ITweenInfo = {
                ease: ease,
                actions: actions,
                update: update,
                complete: complete,
                time: suncore.System.getModuleTimestamp(this.$mod),
                duration: duration
            }
            this.$infos.push(info);
        }

        /**
         * 等待指定时间
         * export
         */
        wait(delay: number, complete: suncom.IHandler = null): Tween {
            const info: ITweenInfo = {
                ease: null,
                actions: [],
                update: null,
                complete: complete,
                time: suncore.System.getModuleTimestamp(this.$mod),
                duration: delay
            }
            this.$infos.push(info);
            return this;
        }

        /**
         * 执行动作
         * @return: 返回允许执行缓动的剩余时间
         */
        doAction(): number {
            const time: number = suncore.System.getModuleTimestamp(this.$mod);
            const info: ITweenInfo = this.$infos[0];

            // 缓动对象可能己经被销毁了
            if (this.$item.destroyed === true) {
                this.cancel();
                return 0;
            }

            let done: boolean = false;
            let timeLeft: number = 0;
            let duration: number = time - info.time;

            if (duration > info.duration) {
                done = true;
                timeLeft = duration - info.duration;
                duration = info.duration;
            }

            const func: Function = info.ease || this.$easeNone;
            for (let i: number = 0; i < info.actions.length; i++) {
                const action: ITweenAction = info.actions[i];
                if (done === true) {
                    this.$item[action.prop] = action.to;
                }
                else {
                    this.$item[action.prop] = func(duration, action.from, action.to - action.from, info.duration);
                }
            }
            if (info.update !== null) {
                info.update.run();
            }

            if (done === false) {
                return 0;
            }
            this.$infos.shift();

            if (this.$infos.length > 0) {
                this.$infos[0].time = suncore.System.getModuleTimestamp(this.$mod);
            }
            info.complete !== null && info.complete.run();

            return timeLeft;
        }

        /**
         * 默认的缓动函数
         */
        private $easeNone(t: number, b: number, c: number, d: number): number {
            let a: number = t / d;
            if (a > 1) {
                a = 1;
            }
            return a * c + b;
        }

        /**
         * 执行缓动的模块
         */
        get mod(): suncore.ModuleEnum {
            return this.$mod;
        }

        /**
         * 缓动是否己取消
         */
        get canceled(): boolean {
            return this.$infos.length === 0;
        }

        /**
         * @mod: 执行缓动的模块，默认为：CUSTOM
         * export
         */
        static get(item: any, mod: suncore.ModuleEnum = suncore.ModuleEnum.CUSTOM): Tween {
            return new Tween(item, mod);
        }
    }
}