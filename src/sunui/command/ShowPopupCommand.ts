
module sunui {

    export class ShowPopupCommand extends AbstractPopupCommand {

        execute(view: IView, duration: number, trans: boolean, props: IViewProps): void {
            // 若配置己存在，则说明节点己经被弹出了
            if (UIManager.getInstance().viewLayer.getInfoByView(view) != null) {
                console.error(`${view}[${view.name}] was already popup.`);
                return;
            }
            // 修正参数
            if (props.keepNode === void 0) { props.keepNode = true; }

            // 参数列表
            const args: any = props.args;
            // 显示层级
            const level: UILevel = view.level || props.level || UILevel.POPUP;
            // 通透值
            const alpha: number = trans == true ? 0 : 1;
            // 是否保留节点
            const keepNode: boolean = props.keepNode;
            // 显示对象类型
            const viewClass: any = props.viewClass;

            delete props.args;
            delete props.level;
            delete props.keepNode;
            delete props.viewClass;

            // 避免props不存在
            props = this.$makeProps(props);

            // 创建遮罩
            const mask: IView = UIManager.getInstance().viewLayer.createMask(view);

            // 生成弹框信息
            const info: IViewStackInfo = {
                view: view,
                viewClass: viewClass,
                mask: mask,
                trans: trans,
                level: level,
                props: props,
                closed: false,
                keepNode: keepNode,
                displayed: false,
                duration: duration,
                cancelAllowed: false
            };

            // 若新视图为POPUP，且存在TOP，则不显示
            const dontPopup: boolean = level == UILevel.POPUP && UIManager.getInstance().viewLayer.hasTopView() == true;

            if (dontPopup == false) {
                UIManager.getInstance().viewLayer.addChild(mask);

                const currActiveInfo: IViewStackInfo = UIManager.getInstance().viewLayer.getActiveViewInfo();
                // 若当前活动的视图为TOP或POPUP，且需要显示的视图亦为TOP或POPUP，则隐藏当前顶层视图
                if (currActiveInfo != null && (currActiveInfo.level == UILevel.TOP || currActiveInfo.level == UILevel.POPUP)) {
                    UIManager.getInstance().viewLayer.removeChild(currActiveInfo.view);
                }
                UIManager.getInstance().viewLayer.addChild(info.view);

                // 应用缓动数据
                this.$showProps(view, props, duration);

                // 遮罩不通透逻辑处理
                mask[Tween.Alpha.KEY] = 0;
                Tween.get(mask).to({ alpha: alpha }, duration, null, suncom.Handler.create(this, this.$onPopupFinish, [view]));

                if (trans == false) {
                    // 获取上一个不通透的对象
                    const stack: IViewStackInfo = UIManager.getInstance().viewLayer.returnLatestStackNotTrans(view);
                    stack != null && Tween.get(stack.mask).to({ alpha: 0 }, duration);
                }
            }

            // 保存视图信息
            UIManager.getInstance().viewLayer.addStack(info);

            // 调用面板弹出事件
            const popup: IPopupView = view as IPopupView;
            popup.$onOpen && popup.$onOpen.apply(view, info.args);
        }

        private $onPopupFinish(view: IView): void {
            const info: IViewStackInfo = UIManager.getInstance().viewLayer.getInfoByView(view);
            if (info == null) {
                return;
            }
            info.displayed = true;
            // 启用面板
            const popup: IPopupView = view as IPopupView;
            popup.$onEnable && popup.$onEnable();
        }
    }
}