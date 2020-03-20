
module sunui {
    /**
     * 缓动类
     * export
     */
    export class Tween extends puremvc.Notifier implements ITween {
        /**
         * 执行缓动的模块
         */
        private $mod: suncore.ModuleEnum;

        /**
         * 缓动对象
         */
        private $item: any;

        /**
         * 缓动信息列表
         */
        private $infos: Array<ITweenInfo> = [];

        /**
         * 最终属性（连续缓动时使用）
         */
        private $props: { [name: string]: number } = null;

        constructor(item: any, mod: suncore.ModuleEnum) {
            super();
            this.$mod = mod;
            this.$item = item;
            if (suncore.System.isModuleStopped(mod) === false) {
                this.facade.sendNotification(NotifyKey.ADD_TWEEN_OBJECT, this);
            }
            else {
                suncom.Logger.error(`尝试添加缓动，但时间轴己停止，mod:${suncore.ModuleEnum[mod]}`);
            }
        }

        /**
         * 取消缓动
         * export
         */
        cancel(): ITween {
            this.$props = null;
            this.$infos.length = 0;
            return this;
        }

        /**
         * 从当前属性缓动至props属性
         * export
         */
        to(props: any, duration: number, ease: Function = null, handler: suncom.IHandler = null): ITween {
            const keys: Array<string> = Object.keys(props);
            const item: any = this.$props === null ? this.$item : this.$props;
            this.$createTweenInfo(keys, item, props, duration, ease, handler);
            return this;
        }

        /**
         * 从props属性缓动至当前属性
         * export
         */
        from(props: any, duration: number, ease: Function = null, handler: suncom.IHandler = null): ITween {
            const keys: Array<string> = Object.keys(props);
            const item: any = this.$props === null ? this.$item : this.$props;
            this.$createTweenInfo(keys, props, item, duration, ease, handler);
            return this;
        }

        /**
         * 以props属性的幅度进行缓动
         * export
         */
        by(props: any, duration: number, ease: Function = null, handler: suncom.IHandler = null): ITween {
            const keys: Array<string> = Object.keys(props);
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
            this.to(props, duration, ease, handler);
            return this;
        }

        /**
         * 生成缓动信息
         */
        private $createTweenInfo(keys: Array<string>, from: any, to: any, duration: number, ease: Function, handler: suncom.IHandler): void {
            // 最终属性
            this.$props = this.$props || {};

            // 动作列表
            const actions: Array<ITweenAction> = [];
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[i];
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
                handler: handler,
                time: suncore.System.getModuleTimestamp(this.$mod),
                duration: duration
            }
            this.$infos.push(info);
        }

        /**
         * 等待指定时间
         * export
         */
        wait(delay: number, handler: suncom.IHandler = null): ITween {
            const info: ITweenInfo = {
                ease: null,
                actions: [],
                handler: handler,
                time: suncore.System.getModuleTimestamp(this.$mod),
                duration: delay
            }
            this.$infos.push(info);
            return this;
        }

        /**
         * 执行动作
         */
        doAction(): void {
            const time: number = suncore.System.getModuleTimestamp(this.$mod);
            const info: ITweenInfo = this.$infos[0];

            // 有时候节点可能被销毁了
            if (this.$item instanceof Laya.Node && this.$item.destroyed === true) {
                this.cancel();
                return;
            }

            let done: boolean = false;
            let duration: number = time - info.time;

            if (duration > info.duration) {
                done = true;
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

            // 缓动未完成
            if (done === false) {
                return;
            }
            this.$infos.shift();

            // 缓动未完成
            if (this.$infos.length > 0) {
                this.$infos[0].time = suncore.System.getModuleTimestamp(this.$mod);
            }

            // 缓动回调
            info.handler !== null && info.handler.run();
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
        static get(item: any, mod: suncore.ModuleEnum = suncore.ModuleEnum.CUSTOM): ITween {
            return new Tween(item, mod);
        }
    }
}