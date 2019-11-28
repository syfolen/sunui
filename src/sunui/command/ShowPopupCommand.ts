
module sunui {
    /**
     * export
     */
    export class ShowPopupCommand extends AbstractPopupCommand {
        /**
         * export
         */
        execute(view: IView, duration: number, trans: boolean, props: IViewProps): void {
            // 若配置己存在，则说明节点己经被弹出了
            if (UIManager.getInstance().viewLayer.getInfoByView(view) !== null) {
                console.error(`${view}[${view.name}] was already popup.`);
                return;
            }
            // 提供默认的缓动方法
            if (props.ease === void 0) { props.ease = Laya.Ease.backOut; }
            // 默认不保存节点
            if (props.keepNode === void 0) { props.keepNode = false; }

            // 参数列表
            const args: any = props.args;
            // 显示层级
            const level: UILevel = view.zOrder || props.level || UILevel.POPUP;
            // 是否保留节点
            const keepNode: boolean = props.keepNode;
            // 显示对象类型
            const viewClass: new () => IView = props.viewClass;

            delete props.args;
            delete props.level;
            delete props.keepNode;
            delete props.viewClass;

            // 避免props的默认属性不存在
            props = this.$makeProps(props);

            // 创建遮罩
            const mask: IView = UIManager.getInstance().viewLayer.createMask(view);
            // 通透值
            const alpha: number = trans == true ? 0 : mask.alpha;

            mask.name = view.name;
            view.zOrder = level;

            // 生成弹框信息
            const info: IViewStackInfo = {
                view: view,
                viewClass: viewClass,
                mask: mask,
                level: level,
                props: props,
                closed: false,
                keepNode: keepNode,
                displayed: false,
                duration: duration,
                cancelAllowed: false
            };
            // 保存视图信息
            UIManager.getInstance().viewLayer.addStack(info);

            // 显示视图
            UIManager.getInstance().viewLayer.addChild(mask);
            UIManager.getInstance().viewLayer.addChild(view);

            // 应用缓动数据
            this.$applyShowProps(view, props, duration);

            // 调用IPopupView的$onOpen接口
            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                UIManager.getInstance().viewLayer.onViewCreate(view, args);
            }

            // 遮罩不通透逻辑处理
            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                const handler = suncom.Handler.create(this, this.$onPopupFinish, [view]);
                Tween.get(mask, suncore.ModuleEnum.CUSTOM).from({ alpha: 0 }, duration, null, handler);
            }
        }

        /**
         * 缓动结束
         */
        private $onPopupFinish(view: IView): void {
            const info: IViewStackInfo = UIManager.getInstance().viewLayer.getInfoByView(view);
            if (info !== null) {
                info.displayed = true;
                UIManager.getInstance().viewLayer.onViewOpen(view);
            }
        }
    }
}