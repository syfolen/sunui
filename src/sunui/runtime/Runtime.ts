
module sunui {
    /**
     * 运行时，可用于维护复杂的UI逻辑次序
     * 适合处理即需要加载、卸载资源，又需要在网络中异步获取数据，且两者频繁交错发生的业务
     * export
     */
    export class Runtime extends puremvc.Notifier {
        /**
         * 超时定时器
         */
        private $var_timerId: number = 0;

        /**
         * 命令序列
         */
        private $var_commands: Command[] = [];

        /**
         * @timeout: 超时时间，默认不会超时
         * export
         */
        constructor(timeout: number = 0) {
            super();
            if (timeout > 0) {
                this.$var_timerId = suncore.System.addTimer(suncore.ModuleEnum.TIMELINE, timeout, this.destroy, this);
            }
            this.facade.registerObserver(NotifyKey.NEXT_COMMAND, this.$func_onNextCommand, this);
        }

        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();

            this.$var_timerId > 0 && suncore.System.removeTimer(this.$var_timerId);
            this.facade.removeObserver(NotifyKey.NEXT_COMMAND, this.$func_onNextCommand, this);

            for (let i: number = 0; i < this.$var_commands.length; i++) {
                this.$var_commands[i].destroy();
            }
        }

        private $func_onNextCommand(command: Command): void {
            let index: number = -1;
            for (let i: number = 0; i < this.$var_commands.length; i++) {
                if (this.$var_commands[i] === command) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                return;
            }
            index++;
            this.facade.notifyCancel();

            if (index < this.$var_commands.length) {
                const command: Command = this.$var_commands[index];
                if (command.running === false) {
                    command.run();
                }
            }
        }

        /**
         * 添加命令次序，运行时将拦截所有符合指定的条件的命令，并在条件满足后将它们重新派发
         * @condition: 拦截条件，返回 true 时进行拦截
         * @monitors[]：拦截将在所有监视结束的同时被解除
         * export
         */
        protected $addCommand(command: string, condition: Function, caller: Object, monitors: Monitor[]): void {
            this.$var_commands.push(new Command(command, suncom.Handler.create(caller, condition, void 0, false), monitors));
            if (this.$var_commands[0].running === false) {
                this.$var_commands[0].run();
            }
        }
    }
}