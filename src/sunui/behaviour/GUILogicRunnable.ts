
module sunui {
    /**
     * 逻辑执行器，用于维护GUI层的命令执行序列
     * export
     */
    export class GUILogicRunnable extends puremvc.Notifier {
        /**
         * 哈希ID
         */
        private $var_hashId: number = suncom.Common.createHashId();

        /**
         * 超时定时器
         */
        private $var_timerId: number = 0;

        /**
         * 命令序列
         */
        private $var_commands: GUILogicCommand[] = [];

        /**
         * 是否自动销毁
         */
        private $var_autoDestroy: boolean = false;

        /**
         * @autoDestroy: 是否自动销毁，默认为：true
         * export
         */
        constructor(autoDestroy: boolean = true) {
            super();
            this.$var_autoDestroy = autoDestroy;
            this.facade.registerObserver(NotifyKey.NEXT_LOGIC_COMMAND, this.$func_onNextLogicCommand, this);
            this.facade.registerObserver(NotifyKey.DESTROY_LOGIC_RUNNABLE, this.$func_onDestroyLogicRunnable, this);
            this.facade.registerObserver(NotifyKey.DESTROY_ALL_LOGIC_RUNNABLE, this.$func_onDestroyAllLogicRunnable, this);
        }

        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();
            this.facade.removeObserver(NotifyKey.NEXT_LOGIC_COMMAND, this.$func_onNextLogicCommand, this);
            this.facade.removeObserver(NotifyKey.DESTROY_LOGIC_RUNNABLE, this.$func_onDestroyLogicRunnable, this);
            this.facade.removeObserver(NotifyKey.DESTROY_ALL_LOGIC_RUNNABLE, this.$func_onDestroyAllLogicRunnable, this);

            for (let i: number = 0; i < this.$var_commands.length; i++) {
                this.$var_commands[i].destroy();
            }
        }

        private $func_onDestroyAllLogicRunnable(): void {
            this.destroy();
        }

        private $func_onDestroyLogicRunnable(hashId: number): void {
            if (this.$var_autoDestroy === false && this.$var_hashId === hashId) {
                this.destroy();
            }
        }

        private $func_onNextLogicCommand(command: GUILogicCommand): void {
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
                const command: GUILogicCommand = this.$var_commands[index];
                if (command.running === false) {
                    command.run();
                }
            }
            else if (this.$var_autoDestroy === true) {
                this.destroy();
            }
        }

        /**
         * 添加命令
         * @condition: 拦截条件，返回true时进行拦截
         * @dependencies：依赖列表
         * export
         */
        protected $addCommand(command: string, condition: suncom.IHandler, dependencies: GUILogicDependence[]): void {
            this.$var_commands.push(new GUILogicCommand(command, condition, dependencies));
            if (this.$var_commands[0].running === false) {
                this.$var_commands[0].run();
            }
        }

        /**
         * 获取Runnable的唯一ID（Runnable销毁时有用）
         * export
         */
        get hashId(): number {
            return this.$var_hashId;
        }
    }
}