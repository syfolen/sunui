
module sunui {
    /**
     * 关闭弹框命令
     */
    export class ClosePopupCommand extends AbstractPopupCommand {

        execute(view: Laya.Sprite, duration: number, destroy: boolean): void {
            const info: IViewStackInfo = M.viewLayer.getInfoByView(view);
            if (info === null) {
                console.warn(`${view}[${view && view.name}]'s pop info is not exist.`);
                return;
            }
            if (destroy !== void 0) { info.keepNode = !destroy; }

            if (info.closed === true) {
                console.warn(`${view}[${view && view.name}]'s pop is already closed.`);
                return;
            }
            info.closed = true;
            M.viewLayer.onViewClose(view);

            if ((info.props.flags & PopupFlagEnum.TRANSPARENT) === PopupFlagEnum.NONE) {
                const tween: Tween = Tween.get(info.mask, suncore.ModuleEnum.SYSTEM);
                if (duration > 200 && (info.props.flags & PopupFlagEnum.SYNC_FADE_TIME) === PopupFlagEnum.NONE) {
                    tween.wait(duration - 200).to({ alpha: 0 }, 200);
                }
                else {
                    tween.to({ alpha: 0 }, duration);
                }
            }
            this.$applyCloseProps(view, info.props, duration);
            suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, duration, this.$onCloseFinish, this, [view]);
        }

        /**
         * 缓动结束
         */
        private $onCloseFinish(view: Laya.Sprite): void {
            // IPopupView的$onRemove方法在ViewLayer中实现
            M.viewLayer.removeInfoByView(view);
        }
    }
}