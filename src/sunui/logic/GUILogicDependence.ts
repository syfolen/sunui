
module sunui {
    /**
     * 逻辑依赖
     * export
     */
    export class GUILogicDependence extends GUILogicInterceptor {
        /**
         * 是否己激活
         */
        private $active: boolean = false;

        protected $onCommandCallback(): void {
            if (this.$active === true && this.$relieved === false) {
                const args: any[] = [];
                for (let i: number = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                if (this.$condition.runWith(args) === true) {
                    this.$relieved = true;
                    this.facade.sendNotification(NotifyKey.ON_INTERCEPTOR_RELIEVED, this, true);
                }
            }
        }

        get active(): boolean {
            return this.$active;
        }
        set active(value: boolean) {
            this.$active = value;
        }
    }
}