
module sunui {
    /**
     * 关闭弹框命令
     */
    export class ClosePopupCommand extends AbstractPopupCommand {

        execute(view: IView, duration: number, destroy: boolean): void {
            const info: IViewStackInfo = M.viewLayer.getInfoByView(view);
            if (info === null) {
                console.error(`${view}[${view.name}]'s infomation is not exist.`);
                return;
            }
            if (info.closed == true) {
                return;
            }
            if (destroy !== void 0) {
                info.keepNode = !destroy;
            }

            // 标记弹框己关闭
            info.closed = true;
            // 应用缓动
            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                this.$applyCloseProps(view, info.props, duration);
            }

            // 调用IPopupView的$onDisable接口
            M.viewLayer.onViewClose(view);
            this.facade.sendNotification(NotifyKey.ON_POPUP_CLOSED, view);

            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                const handler: suncom.IHandler = suncom.Handler.create(this, this.$onCloseFinish, [view]);
                /**
                 * TODO:
                 * 这里按要求将duration改成固定200，此处的回调，应当亦延时200毫秒触发，否则关闭逻辑会出现问题
                 */
                Tween.get(info.mask, suncore.ModuleEnum.CUSTOM).to({ alpha: 200 }, duration, null, handler);
            }
        }

        /**
         * 缓动结束
         */
        private $onCloseFinish(view: IView): void {
            // IPopupView的$onRemove方法在ViewLayer中实现
            M.viewLayer.removeStackByView(view);
        }
    }
}