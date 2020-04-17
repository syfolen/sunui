
module sunui {
    /**
     * 关闭弹框命令
     */
    export class ClosePopupCommand extends AbstractPopupCommand {

        execute(view: Laya.Sprite, duration: number, destroy: boolean): void {
            const info: IViewStackInfo = M.viewLayer.getInfoByView(view);
            if (info === null) {
                suncom.Logger.error(suncom.DebugMode.ANY, `${view}[${view.name}]'s infomation is not exist.`);
                return;
            }
            if (destroy !== void 0) { info.keepNode = !destroy; }

            if (info.closed === true) {
                return;
            }
            info.closed = true;
            // // 避免因模块停止引起缓动意外
            // this.$makeProps(info.props);

            M.viewLayer.onViewClose(view);
            this.facade.sendNotification(NotifyKey.ON_POPUP_CLOSED, view);

            if ((info.props.flags & PopupFlagEnum.TRANSPARENT) === PopupFlagEnum.NONE) {
                const tween: ITween = Tween.get(info.mask, info.props.mod);
                if (duration > 200 && (info.props.flags & PopupFlagEnum.SYNC_FADE_TIME) === PopupFlagEnum.NONE) {
                    tween.wait(duration - 200).to({ alpha: 0 }, 200);
                }
                else {
                    tween.to({ alpha: 0 }, duration);
                }
            }
            this.$applyCloseProps(view, info.props, duration);

            const handler: suncom.IHandler = suncom.Handler.create(this, this.$onCloseFinish, [view]);
            suncore.System.addTrigger(info.props.mod, duration, handler);
        }

        /**
         * 缓动结束
         */
        private $onCloseFinish(view: Laya.Sprite): void {
            // IPopupView的$onRemove方法在ViewLayer中实现
            M.viewLayer.removeStackByView(view);
        }
    }
}