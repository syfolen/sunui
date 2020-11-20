
module sunui {
    /**
     * 缓动类
     * 说明：
     * 1. 缓动类内置了对象池，当缓动结束或被取消后没有立即被重新指定动作，则会在下一帧自动回收
     * 2. 由于缓动对象只有在被回收后才会自动释放资源，故不建议在外部持有不工作的缓动对象
     * 3. 若你的需求必须这么做，则可以这么来防止Tween被回收：Tween.get(target).usePool(false);
     * 4. 当外部持有的Tween被弃用时，请记得及时回收
     * export
     */
    export class Tween extends puremvc.Notifier {
        /**
         * 唯一ID
         */
        private $hashId: number = 0;

        /**
         * 执行缓动的模块
         */
        private $mod: suncore.ModuleEnum = suncore.ModuleEnum.SYSTEM;

        /**
         * 缓动对象
         */
        private $target: any = null;

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

        private $setTo(target: any, mod: suncore.ModuleEnum): Tween {
            if (this.$hashId === -1) {
                throw Error(`Tween己被回收！！！`);
            }
            this.$mod = mod;
            this.$target = target;
            this.$hashId = suncom.Common.createHashId();
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
         * 回收到对象池
         * export
         */
        recover(): void {
            if (suncom.Pool.recover("sunui.Tween", this.cancel()) === true) {
                this.$hashId = -1;
            }
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
            const item: any = this.$props === null ? this.$target : this.$props;
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
            const item: any = this.$props === null ? this.$target : this.$props;
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
            const item: any = this.$props === null ? this.$target : this.$props;
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[i];
                if (this.$props === null || this.$props[key] === void 0) {
                    props[key] += this.$target[key];
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
            this.$addAction(action);

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
                    clip.from = this.$target[key];
                }
                // 更新最终属性，用来支持连续缓动的实现
                this.$props[key] = to[key];
                // 第一次执行from缓动时会有点问题
                if (this.$actions.length === 0) {
                    this.$target[clip.prop] = clip.from;
                }
                action.clips.push(clip);
            }
        }

        /**
         * 添加动作
         */
        private $addAction(action: TweenAction): void {
            if (this.$hashId === -1) {
                throw Error(`Tween己被回收！！！`);
            }
            this.$actions.push(action);
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
            this.$addAction(action);
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
            if (this.$target.destroyed === true) {
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
                    this.$target[clip.prop] = clip.to;
                }
                else {
                    this.$target[clip.prop] = func(duration, clip.from, clip.to - clip.from, action.duration);
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
         * 是否使用对象池
         * 说明：
         * 1. 若使用了对象池，且缓动结束或被取消后没有重新指定动作，则在下一帧自动回收
         * export
         */
        usePool(value: boolean): Tween {
            this.$usePool = value;
            return this;
        }

        /**
         * 查询是否使用了对象池
         */
        getUsePool(): boolean {
            return this.$usePool;
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
         * @target: 执行缓动的对象
         * @mod: 执行缓动的模块，默认为：CUSTOM
         * export
         */
        static get(target: any, mod: suncore.ModuleEnum = suncore.ModuleEnum.CUSTOM): Tween {
            const tween: Tween = new Tween();
            tween.$hashId = 0;
            return tween.usePool(true).$setTo(target, mod);
        }
    }
}