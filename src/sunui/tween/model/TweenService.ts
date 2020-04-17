
module sunui {
    /**
     * 缓动中介类，专门用于管理缓动
     */
    export class TweenService extends suncore.BaseService {

        private $tweens: Array<ITween | boolean> = [false];

        protected $onRun(): void {
            this.facade.registerObserver(NotifyKey.REGISTER_TWEEN_OBJECT, this.$onAddTweenObject, this);
            this.facade.registerObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this, false, suncom.EventPriorityEnum.EGL);
        }

        protected $onStop(): void {
            this.facade.removeObserver(NotifyKey.REGISTER_TWEEN_OBJECT, this.$onAddTweenObject, this);
            this.facade.removeObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this);
        }

        /**
         * 帧事件，缓动驱动函数
         */
        protected $frameLoop(): void {
            const tweens: Array<boolean | ITween> = this.$tweens;

            this.$tweens[0] = true;

            for (let mod: suncore.ModuleEnum = suncore.ModuleEnum.MIN; mod < suncore.ModuleEnum.MAX; mod++) {
                if (suncore.System.isModulePaused(mod) === false) {
                    for (let i: number = tweens.length - 1; i > 0; i--) {
                        const tween: ITween = tweens[i] as ITween;
                        if (tween.mod === mod) {
                            let timeLeft: number = 1;
                            while (timeLeft > 0 && tween.canceled === false) {
                                timeLeft = tween.doAction();
                            }
                        }
                    }
                }
            }

            this.$tweens[0] = false;

            for (let i: number = this.$tweens.length - 1; i > 0; i--) {
                const tween: ITween = this.$tweens[i] as ITween;
                if (tween.canceled === true) {
                    tweens.splice(i, 1);
                }
            }
        }

        /**
         * 时间轴暂停事件回调，仅关心停止事件
         */
        private $onTimelinePause(mod: suncore.ModuleEnum, stop: boolean): void {
            if (stop === true) {
                for (let i: number = 1; i < this.$tweens.length; i++) {
                    const tween: ITween = this.$tweens[i] as ITween;
                    if (tween.mod === mod) {
                        tween.cancel();
                    }
                }
            }
        }

        /**
         * 添加缓动对象
         */
        private $onAddTweenObject(tween: ITween): void {
            // 避免干扰
            if (this.$tweens[0] === true) {
                this.$tweens = this.$tweens.slice(0);
                this.$tweens[0] = false;
            }
            this.$tweens.push(tween);
        }
    }
}