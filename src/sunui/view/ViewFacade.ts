
module sunui {
    /**
     * export
     */
    export class ViewFacade extends puremvc.Notifier {
        /**
         * 弹出对象
         */
        private $view: IView;

        /**
         * 弹出信息配置
         */
        private $info: IViewStackInfo = null;

        /**
         * 缓动时间
         */
        private $duration: number;

        /**
         * 弹出框外观
         * @param view 弹出对象
         * @param duration 缓动时间，默认为200
         * export
         */
        constructor(view: any, duration?: number) {
            super();
            this.$view = view;

            // 若存在配置
            if (this.info) {
                this.$duration = this.info.duration;
            }
            // 若缓动时间未设置，则使用默认值
            else if (duration === void 0) {
                this.$duration = 200;
            }
            else {
                this.$duration = duration;
            }
        }

        /**
         * 执行弹出逻辑
         * export
         */
        popup(trans: boolean = false, props: IViewProps = {}): ViewFacade {
            if (this.facade.hasCommand(NotifyKey.SHOW_POPUP) == true) {
                this.facade.sendNotification(NotifyKey.SHOW_POPUP, [this.$view, this.$duration, trans, props]);
            }
            return this;
        }

        /**
         * 执行关闭逻辑
         * export
         */
        close(destroy?: boolean): void {
            if (this.facade.hasCommand(NotifyKey.CLOSE_POPUP) == true) {
                this.facade.sendNotification(NotifyKey.CLOSE_POPUP, [this.$view, this.$duration, destroy]);
            }
        }

        /**
         * 设置是否允许取消，默认为false
         * export
         */
        get cancelAllowed(): boolean {
            return this.info.cancelAllowed;
        }
        /**
         * export
         */
        set cancelAllowed(yes: boolean) {
            this.info.cancelAllowed = yes;
        }

        /**
         * 获取配置信息
         */
        get info(): IViewStackInfo {
            if (this.$info == null) {
                this.$info = UIManager.getInstance().viewLayer.getInfoByView(this.$view);
            }
            return this.$info;
        }
    }
}