
module sunui {

    export class ClosePopupCommand extends AbstractPopupCommand {

        execute(view: IView, duration: number, destroy: boolean): void {
            const info: IViewStackInfo = UIManager.getInstance().viewLayer.getInfoByView(view);
            if (info.closed == true) {
                return;
            }
            if (destroy !== void 0) {
                info.keepNode = !destroy;
            }

            info.closed = true;

            // 应用缓动
            this.$closeProps(view, info.props, duration);

            // 显示上一个视图
            const stack: IViewStackInfo = UIManager.getInstance().viewLayer.getActiveViewInfo();
            // 只有TOP和POPUP类型的视图才需要重新显示
            if (stack != null && (stack.level == UILevel.TOP || stack.level == UILevel.POPUP)) {
                UIManager.getInstance().viewLayer.addChild(stack.view);
                this.$showProps(stack.view, stack.props, duration);
            }

            Tween.get(info.mask).to({ alpha: 0 }, duration, null, suncom.Handler.create(this, this.$onCloseFinish, [view]));
            if (info.trans == false) {
                // 获取上一个不通透的对象
                const stack: IViewStackInfo = UIManager.getInstance().viewLayer.returnLatestStackNotTrans(view);
                stack != null && Tween.get(stack.mask).to({ alpha: 1 }, duration);
            }

            const popup: IPopupView = view as IPopupView;
            popup.$onDisable && popup.$onDisable();
        }

        /**
         * 关闭结束
         */
        private $onCloseFinish(view: IView): void {
            const info: IViewStackInfo = UIManager.getInstance().viewLayer.getInfoByView(view);
            if (info != null) {
                UIManager.getInstance().viewLayer.removeStackByInfo(info);
            }
            // IPopupView的$onRemove方法在ViewLayer中实现
        }
    }
}