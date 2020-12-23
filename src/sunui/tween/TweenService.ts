
module sunui {
    /**
     * 缓动服务类，专门用于管理缓动
     */
    export class TweenService extends suncore.BaseService {
        /**
         * 避免添加或移除缓动对象时对正在执行的缓动列表产生干扰
         */
        private $locker: boolean = false;

        /**
         * 缓动对象列表
         */
        private $tweens: Tween[] = [];

        protected $onRun(): void {
            this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this, false, suncom.EventPriorityEnum.EGL);
            this.facade.registerObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this, false, suncom.EventPriorityEnum.EGL);
            this.facade.registerObserver(NotifyKey.REGISTER_TWEEN_OBJECT, this.$onRegisterTweenObject, this);
        }

        protected $onStop(): void {
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            this.facade.removeObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this);
            this.facade.removeObserver(NotifyKey.REGISTER_TWEEN_OBJECT, this.$onRegisterTweenObject, this);
        }

        /**
         * 帧事件，缓动驱动函数
         */
        private $onEnterFrame(): void {
            this.$locker = true;

            // 使用临时变量持有tweens列表，因为列表在执行的过程中可能会被复制
            const tweens: Tween[] = this.$tweens;

            for (let mod: suncore.ModuleEnum = 0; mod < suncore.ModuleEnum.MAX; mod++) {
                if (suncore.System.isModulePaused(mod) === false) {
                    for (let i: number = 0; i < tweens.length; i++) {
                        const tween: Tween = tweens[i];
                        if (tween.var_mod === mod) {
                            let timeLeft: number = 1;
                            while (timeLeft > 0 && tween.var_canceled === false) {
                                timeLeft = tween.func_doAction();
                            }
                        }
                    }
                }
            }

            // 移除己被取消的缓动对象
            for (let i: number = this.$tweens.length - 1; i > -1; i--) {
                const tween: Tween = this.$tweens[i];
                if (tween.var_canceled === true && tween.func_getUsePool() === true) {
                    suncom.Pool.recover("sunui.Tweeen", tweens.splice(i, 1)[0]);
                }
            }

            this.$locker = false;
        }

        /**
         * 时间轴暂停事件回调，仅关心停止事件
         */
        private $onTimelinePause(mod: suncore.ModuleEnum, stop: boolean): void {
            if (stop === true) {
                for (let i: number = 0; i < this.$tweens.length; i++) {
                    const tween: Tween = this.$tweens[i];
                    if (tween.var_mod === mod) {
                        tween.cancel();
                    }
                }
            }
        }

        /**
         * 添加缓动对象
         */
        private $onRegisterTweenObject(tween: Tween): void {
            // 避免干扰
            if (this.$locker === true) {
                this.$tweens = this.$tweens.slice(0);
                this.$locker = false;
            }
            this.$tweens.push(tween);
        }
    }
}