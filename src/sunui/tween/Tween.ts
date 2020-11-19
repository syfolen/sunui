
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
         * 最终属性（连续缓动时使用）
         */
        private $props: { [name: string]: number } = null;

        /**
         * 缓动信息列表
         */
        private $actions: TweenAction[] = [];

        /**
         * 是否使用对象池
         */
        private $usePool: boolean = false;

        private $setTo(item: any, mod: suncore.ModuleEnum): Tween {
            this.$mod = mod;
            this.$item = item;
            if (suncore.System.isModuleStopped(mod) === false) {
                this.facade.sendNotification(NotifyKey.REGISTER_TWEEN_OBJECT, this);
            }
            else {
                suncom.Logger.error(suncom.DebugMode.ANY, `尝试添加缓动，但时间轴己停止，mod:${suncore.ModuleEnum[mod]}`);
            }
            return this;
        }

        /**
         * 取消缓动
         * export
         */
        cancel(): Tween {
            this.$props = null;
            while (this.$actions.length > 0) {
                this.$actions.pop().recover();
            }
            return this;
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
        by(props: any, duration: number, ease: Function = null, complete: suncom.Handler = null): Tween {
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
        private $createTweenInfo(keys: string[], from: any, to: any, duration: number, ease: Function, update: suncom.Handler, complete: suncom.Handler): void {
            // 最终属性
            this.$props = this.$props || {};

            const action: TweenAction = TweenAction.create();
            action.ease = ease;
            action.update = update;
            action.complete = complete;
            action.time = suncore.System.getModuleTimestamp(this.$mod);
            action.duration = duration;
            this.$actions.push(action);

            // 解析动作列表
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[i];
                if (key === "update") {
                    continue;
                }
                const clip: TweenActionClip = TweenActionClip.create();
                clip.to = to[key];
                clip.from = from[key];
                clip.prop = key;
                if (clip.from === void 0) {
                    clip.from = this.$item[key];
                }
                // 更新最终属性，用来支持连续缓动的实现
                this.$props[key] = to[key];
                // 第一次执行from缓动时会有点问题
                if (this.$actions.length === 0) {
                    this.$item[clip.prop] = clip.from;
                }
                action.clips.push(clip);
            }
        }

        /**
         * 等待指定时间
         * export
         */
        wait(delay: number, complete: suncom.Handler = null): Tween {
            const action: TweenAction = TweenAction.create();
            action.complete = complete;
            action.time = suncore.System.getModuleTimestamp(this.$mod);
            action.duration = delay;
            this.$actions.push(action);
            return this;
        }

        /**
         * 执行动作
         * @return: 返回允许执行缓动的剩余时间
         */
        doAction(): number {
            const time: number = suncore.System.getModuleTimestamp(this.$mod);
            const action: TweenAction = this.$actions[0];

            // 缓动对象可能己经被销毁了
            if (this.$item.destroyed === true) {
                this.cancel();
                return 0;
            }

            let done: boolean = false;
            let timeLeft: number = 0;
            let duration: number = time - action.time;

            if (duration > action.duration) {
                done = true;
                timeLeft = duration - action.duration;
                duration = action.duration;
            }

            const func: Function = action.ease || this.$easeNone;
            for (let i: number = 0; i < action.clips.length; i++) {
                const clip: TweenActionClip = action.clips[i];
                if (done === true) {
                    this.$item[clip.prop] = clip.to;
                }
                else {
                    this.$item[clip.prop] = func(duration, clip.from, clip.to - clip.from, action.duration);
                }
            }
            if (action.update !== null) {
                action.update.run();
            }

            if (done === false) {
                return 0;
            }
            this.$actions.shift().recover();

            if (this.$actions.length > 0) {
                this.$actions[0].time = suncore.System.getModuleTimestamp(this.$mod);
            }
            action.complete !== null && action.complete.run();

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
            return this.$actions.length === 0;
        }

        /**
         * 是否使用对象池
         * 说明：
         * 1. 若使用了对象池，且缓动结束或被取消后没有重新指定动作，则自动回收
         * export
         */
        get usePool(): boolean {
            return this.$usePool;
        }
        set usePool(value: boolean) {
            this.$usePool = value;
        }

        /**
         * @mod: 执行缓动的模块，默认为：CUSTOM
         * export
         */
        static get(item: any, mod: suncore.ModuleEnum = suncore.ModuleEnum.CUSTOM): Tween {
            return new Tween().$setTo(item, mod);
        }
    }
}