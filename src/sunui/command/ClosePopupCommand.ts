
module sunui {
    /**
     * 关闭弹框命令
     * export
     */
    export class ClosePopupCommand extends AbstractPopupCommand {

        /**
         * export
         */
        execute(view: IView, duration: number, destroy: boolean): void {
            const info: IViewStackInfo = UIManager.getInstance().viewLayer.getInfoByView(view);
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
            UIManager.getInstance().viewLayer.onViewClose(view);

            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                const handler = suncom.Handler.create(this, this.$onCloseFinish, [view]);
                Tween.get(info.mask, suncore.ModuleEnum.CUSTOM).to({ alpha: 0 }, duration, null, handler);
            }
        }

        /**
         * 缓动结束
         */
        private $onCloseFinish(view: IView): void {
            // IPopupView的$onRemove方法在ViewLayer中实现
            UIManager.getInstance().viewLayer.removeStackByView(view);
        }
    }
}