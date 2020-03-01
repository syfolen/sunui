
module sunui {
    /**
     * 视图关系对象
     * export
     */
    export class ViewContact extends puremvc.Notifier {
        /**
         * 执行脚本的视图对象
         */
        private $caller: any;

        /**
         * 被监视的弹框对象
         */
        private $popup: Laya.Node;

        /**
         * 弹框被关闭时需要执行的回调
         */
        private $closedHandler: suncom.IHandler = null;

        /**
         * 弹框被移除时需要执行的回调
         */
        private $removedHandler: suncom.IHandler = null;

        /**
         * @caller: 脚本回调对象，允许为非弹框对象
         * @popup: 被监视的视图对象，必须为弹框对象
         * export
         */
        constructor(caller: any, popup: Laya.Node) {
            super();
            this.$popup = popup;
            this.$caller = caller;

            if (M.viewLayer.getInfoByView(popup) === null) {
                throw Error(`找不到${popup.name}的弹出信息，请确认其为弹出对象`);
            }
            this.facade.registerObserver(NotifyKey.ON_POPUP_CLOSED, this.$onPopupClosed, this);
            this.facade.registerObserver(NotifyKey.ON_POPUP_REMOVED, this.$onPopupRemoved, this);

            // 若场景退出了，则应当销毁自己
            this.facade.registerObserver(NotifyKey.EXIT_SCENE, this.$onCallerDestroy, this);
            // 若caller为弹框则监听弹框销毁事件
            const info: IViewStackInfo = M.viewLayer.getInfoByView(caller);
            if (info !== null) {
                this.facade.registerObserver(NotifyKey.ON_POPUP_REMOVED, this.$onCallerDestroy, this);
            }
            // 否则应当监听由caller主动派发的销毁事件
            else {
                this.facade.registerObserver(NotifyKey.ON_CALLER_DESTROYED, this.$onCallerDestroy, this);
            }
        }

        /**
         * 退出场景视为销毁caller
         */
        private $onExitScene(): void {
            this.$onCallerDestroy(this.$caller);
        }

        /**
         * 当caller被销毁时，应当注销所有事件
         */
        private $onCallerDestroy(caller: any): void {
            if (caller === this.$caller) {
                this.facade.removeObserver(NotifyKey.ON_POPUP_CLOSED, this.$onPopupClosed, this);
                this.facade.removeObserver(NotifyKey.ON_POPUP_REMOVED, this.$onPopupRemoved, this);

                this.facade.removeObserver(NotifyKey.EXIT_SCENE, this.$onCallerDestroy, this);
                this.facade.removeObserver(NotifyKey.ON_POPUP_REMOVED, this.$onCallerDestroy, this);
                this.facade.removeObserver(NotifyKey.ON_CALLER_DESTROYED, this.$onCallerDestroy, this);
            }
        }

        /**
         * 弹框被关闭
         */
        private $onPopupClosed(popup: Laya.Node): void {
            if (popup === this.$popup) {
                if (this.$closedHandler !== null) {
                    this.$closedHandler.run();
                    this.$closedHandler = null;
                }
                // 若不存在removed事件则需要销毁Contact
                if (this.$removedHandler === null) {
                    this.$onCallerDestroy(this.$caller);
                }
            }
        }

        /**
         * 弹框被移除
         */
        private $onPopupRemoved(popup: Laya.Node): void {
            if (popup === this.$popup) {
                if (this.$removedHandler !== null) {
                    this.$removedHandler.run();
                    this.$removedHandler = null;
                }
                // 执行完removed方法后，应当直接销毁Contact
                this.$onCallerDestroy(this.$caller);
            }
        }

        /**
         * 注册弹框被关闭时需要执行的回调（详见ON_POPUP_CLOSED）
         * export
         */
        onPopupClosed(method: Function, caller: any, args?: any[]): ViewContact {
            if (this.$caller !== caller) {
                throw Error(`caller与执行者不一致`);
            }
            if (this.$closedHandler === null) {
                this.$closedHandler = suncom.Handler.create(caller, method, args);
            }
            else {
                throw Error(`重复注册弹框关闭事件`);
            }
            return this;
        }

        /**
         * 注册弹框被销毁时需要执行的回调（详见ON_POPUP_REMOVED）
         * export
         */
        onPopupRemoved(method: Function, caller: any, args?: any[]): ViewContact {
            if (this.$caller !== caller) {
                throw Error(`caller与执行者不一致`);
            }
            if (this.$removedHandler === null) {
                this.$removedHandler = suncom.Handler.create(caller, method, args);
            }
            else {
                throw Error(`重复注册弹框移除事件`);
            }
            return this;
        }
    }
}