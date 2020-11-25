
module sunui {
    /**
     * 逻辑依赖
     * export
     */
    export class GUILogicDependence extends GUILogicInterceptor {
        /**
         * 是否己激活
         */
        private $var_active: boolean = false;

        protected $func_onCommandCallback(): void {
            if (this.$var_active === true && this.$var_relieved === false) {
                const args: any[] = [];
                for (let i: number = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                if (this.$var_condition.runWith(args) === true) {
                    this.$var_relieved = true;
                    this.facade.sendNotification(NotifyKey.ON_INTERCEPTOR_RELIEVED, this, true);
                }
            }
        }

        get var_active(): boolean {
            return this.$var_active;
        }
        set var_active(value: boolean) {
            this.$var_active = value;
        }
    }
}