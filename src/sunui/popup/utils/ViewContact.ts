
module sunui {
    /**
     * 视图关系对象
     * export
     */
    export class ViewContact extends puremvc.Notifier {
        /**
         * 弹出框（显示对象）
         */
        private $popup: IView;

        /**
         * 回调对象（脚本）
         */
        private $caller: any;

        /**
         * 弹框被关闭时需要执行的回调
         */
        private $closedHandler: suncom.IHandler = null;

        /**
         * 弹框被移除时需要执行的回调
         */
        private $removedHandler: suncom.IHandler = null;

        /**
         * @caller: 回调对象（脚本）
         * @popup: 被监视的显示对象（必须为通过ViewFacade.popup弹出的显示对象）
         * 说明：
         * 1. 若caller为非弹出对象，则销毁前应当主动派发NotifyKey.ON_CALLER_DESTROYED事件，否则ViewContact不会自动回收
         * export
         */
        constructor(caller: any, popup: any) {
            super();
            this.$popup = popup || null;
            this.$caller = caller || null;

            if (M.viewLayer.getInfoByView(popup) === null) {
                throw Error(`找不到${popup.name}的弹出信息，请确认其为弹出对象`);
            }
            this.facade.registerObserver(NotifyKey.ON_POPUP_CLOSED, this.$onPopupClosed, this, false, suncom.EventPriorityEnum.FWL);
            this.facade.registerObserver(NotifyKey.ON_POPUP_REMOVED, this.$onPopupRemoved, this, false, suncom.EventPriorityEnum.FWL);

            if (M.viewLayer.getInfoByView(caller) !== null) {
                this.facade.registerObserver(NotifyKey.ON_POPUP_REMOVED, this.$onCallerDestroy, this, false, suncom.EventPriorityEnum.FWL);
            }
            else {
                this.facade.registerObserver(NotifyKey.ON_CALLER_DESTROYED, this.$onCallerDestroy, this, false, suncom.EventPriorityEnum.FWL);
            }
            // 此监听为系统级别的监听，这么做主要是为了让所有的视图关系在uniCls.$onLeaveScene执行之前解除
            this.facade.registerObserver(NotifyKey.LEAVE_SCENE, this.$onLeaveScene, this, false, suncom.EventPriorityEnum.OSL);
        }

        /**
         * 离开场景视为销毁caller
         */
        private $onLeaveScene(): void {
            this.facade.removeObserver(NotifyKey.ON_POPUP_CLOSED, this.$onPopupClosed, this);
            this.facade.removeObserver(NotifyKey.ON_POPUP_REMOVED, this.$onPopupRemoved, this);

            this.facade.removeObserver(NotifyKey.LEAVE_SCENE, this.$onCallerDestroy, this);
            this.facade.removeObserver(NotifyKey.ON_POPUP_REMOVED, this.$onCallerDestroy, this);
            this.facade.removeObserver(NotifyKey.ON_CALLER_DESTROYED, this.$onCallerDestroy, this);
        }

        /**
         * 当caller被销毁时，应当注销所有事件
         */
        private $onCallerDestroy(caller: any): void {
            if (caller === this.$caller) {
                this.$onLeaveScene();
            }
        }

        /**
         * 弹框己关闭
         */
        private $onPopupClosed(popup: IView): void {
            if (popup === this.$popup) {
                if (this.$closedHandler !== null) {
                    this.$closedHandler.run();
                    this.$closedHandler = null;
                }
            }
        }

        /**
         * 弹框己移除
         */
        private $onPopupRemoved(popup: IView): void {
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
         * 注册弹框被移除时需要执行的回调（详见ON_POPUP_REMOVED）
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