
module sunui {
    /**
     * 弹框外观类，实现通用的弹窗功能
     * export
     */
    export class ViewFacade extends puremvc.Notifier {
        /**
         * 弹出对象
         */
        private $var_view: IView;

        /**
         * 弹出信息配置
         */
        private $var_info: IViewStackInfo = null;

        /**
         * 缓动时间
         */
        private $var_duration: number;

        /**
         * 弹出框外观
         * @view 弹出对象
         * @duration 缓动时间，默认为200毫秒
         * export
         */
        constructor(view: any, duration?: number) {
            super();
            this.$var_view = view;
            // 若存在配置
            if (this.var_info !== null) {
                this.$var_duration = this.var_info.duration;
            }
            // 若缓动时间未设置，则使用默认值
            else if (duration === void 0) {
                this.$var_duration = 200;
            }
            else {
                this.$var_duration = duration;
            }
        }

        /**
         * 执行弹出逻辑
         * export
         */
        popup(props: IViewProps = {}): ViewFacade {
            this.facade.sendNotification(NotifyKey.SHOW_POPUP, [this.$var_view, this.$var_duration, props]);
            return this;
        }

        /**
         * 执行关闭逻辑
         * @destroy: 关闭后是否销毁节点，默认为true
         * export
         */
        close(destroy?: boolean): void {
            this.facade.sendNotification(NotifyKey.CLOSE_POPUP, [this.$var_view, this.$var_duration, destroy]);
        }

        /**
         * 设置是否允许取消，默认为false
         * export
         */
        get cancelAllowed(): boolean {
            return this.var_info.cancelAllowed;
        }

        /**
         * depends
         */
        set cancelAllowed(yes: boolean) {
            this.var_info.cancelAllowed = yes;
        }

        /**
         * 获取配置信息
         */
        get var_info(): IViewStackInfo {
            if (this.$var_info === null) {
                this.$var_info = M.viewLayer.getInfoByView(this.$var_view);
            }
            return this.$var_info;
        }
    }
}