
module sunui {
    /**
     * 关闭弹框命令
     */
    export class ClosePopupCommand extends AbstractPopupCommand {

        execute(view: Laya.Sprite, duration: number, destroy: boolean): void {
            const info: IViewStackInfo = M.viewLayer.getInfoByView(view);
            if (info === null) {
                suncom.Logger.error(`${view}[${view.name}]'s infomation is not exist.`);
                return;
            }

            if (destroy !== void 0) { info.keepNode = !destroy; }

            if (info.closed === true) {
                return;
            }
            // 标记弹框己关闭
            info.closed = true;

            // 调用IPopupView的$onDisable接口
            M.viewLayer.onViewClose(view);
            this.facade.sendNotification(NotifyKey.ON_POPUP_CLOSED, view);

            // 应用缓动
            this.$applyCloseProps(view, info.props, duration);

            // 遮罩不通透逻辑处理
            if (info.props.trans === false) {
                const tween: ITween = Tween.get(info.mask, info.props.mod);
                if (duration > 200) {
                    tween.wait(duration - 200).to({ alpha: 0 }, 200);
                }
                else {
                    tween.to({ alpha: 0 }, duration);
                }
            }

            // 弹框移除回调
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