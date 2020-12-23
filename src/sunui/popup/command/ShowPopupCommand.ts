
module sunui {
    /**
     * 打开弹框命令
     */
    export class ShowPopupCommand extends AbstractPopupCommand {

        execute(view: IView, duration: number, props: IViewProps): void {
            if (M.viewLayer.getInfoByView(view) !== null) {
                suncom.Logger.error(suncom.DebugMode.ANY, `${view}[${view.name}] is already popup.`);
                return;
            }
            if (props.mod === void 0) { props.mod = suncore.ModuleEnum.CUSTOM; }
            if (props.ease === void 0) { props.ease = Laya.Ease.backOut; }
            if (props.flags === void 0) { props.flags = PopupFlagEnum.NONE; }
            if (props.keepNode === void 0) { props.keepNode = false; }

            // 默认为: SIMPLY
            if ((props.flags & PopupFlagEnum.SIMPLY) === PopupFlagEnum.SIMPLY) {
                props.flags &= ~PopupFlagEnum.SIMPLY;
            }
            else {
                props.flags |= PopupFlagEnum.SIMPLY;
            }

            const args: any = props.args;
            const level: UILevel = props.level || view.zOrder || UILevel.POPUP;
            const keepNode: boolean = props.keepNode;

            delete props.args;
            delete props.level;
            delete props.keepNode;

            // 大小分辨率适配
            if (view instanceof fairygui.GComponent && view.is1920x1080 === false) {
                const scale: number = suncom.Global.height / 720;
                view["setScale"](scale, scale);
            }

            // 避免props的默认属性不存在
            this.$makeProps(view, props);
            // 由于历史遗留问题，故需要考虑props.trans的值
            if (props.trans === true && (props.flags & PopupFlagEnum.TRANSPARENT) === PopupFlagEnum.NONE) {
                suncom.Logger.warn(suncom.DebugMode.ANY, `ViewFacade：props的trans属性己弃用，请使用flags代替！！！`);
                props.flags |= PopupFlagEnum.TRANSPARENT;
            }

            const mask: Laya.Image | fairygui.GLoader = M.viewLayer.createMask(view, props);
            mask.name = `Mask$${view.name}`;
            mask.zOrder = view.zOrder = level;

            const info: IViewStackInfo = {
                view: view,
                mask: mask,
                props: props,
                closed: false,
                keepNode: keepNode,
                displayed: false,
                duration: duration,
                cancelAllowed: true
            };
            M.viewLayer.addToStack(info);

            M.viewLayer.addChild(mask as IView);
            M.viewLayer.addChild(view);

            if (view instanceof Laya.View) {
                // 第一次显示的时候，轴心点可能会不正确
                view.pivot(view.width * 0.5, view.height * 0.5);
            }
            M.viewLayer.onViewCreate(view, args);

            if ((props.flags & PopupFlagEnum.TRANSPARENT) === PopupFlagEnum.NONE) {
                if (props.flags & PopupFlagEnum.SYNC_FADE_TIME) {
                    Tween.get(mask, info.props.mod).from({ alpha: 0 }, duration);
                }
                else {
                    Tween.get(mask, info.props.mod).from({ alpha: 0 }, duration > 200 ? 200 : duration);
                }
            }
            this.$applyShowProps(view, props, duration);
            suncore.System.addTrigger(info.props.mod, duration, this, this.$onPopupFinish, [view]);
        }

        /**
         * 缓动结束
         */
        private $onPopupFinish(view: Laya.Sprite): void {
            const info: IViewStackInfo = M.viewLayer.getInfoByView(view);
            if (info !== null && info.closed === false) {
                info.displayed = true;
                M.viewLayer.onViewOpen(view);
            }
        }
    }
}