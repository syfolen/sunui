
module sunui {
    /**
     * 可运行对象
     * export
     */
    export abstract class Runnable extends puremvc.Notifier {
        /**
         * 需要拦截的命令
         */
        protected $var_command: string = null;

        /**
         * 是否己释放
         */
        protected $var_released: boolean = false;

        /**
         * 拦截条件（返回true时表示符合拦截条件）
         */
        protected $var_condition: suncom.IHandler = null;

        /**
         * @condition: 返回true时表示符合拦截条件
         * export
         */
        constructor(command: string, condition: suncom.IHandler) {
            super();
            this.$var_command = command;
            this.$var_condition = condition;
            this.facade.registerObserver(command, this.$func_onCommandCallback, this, false, suncom.EventPriorityEnum.HIGHEST);
        }

        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();
            this.facade.removeObserver(this.$var_command, this.$func_onCommandCallback, this);
        }

        protected abstract $func_onCommandCallback(): void;

        get var_command(): string {
            return this.$var_command;
        }

        get var_released(): boolean {
            return this.$var_released;
        }
    }
}