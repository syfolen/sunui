
module sunui {
    /**
     * 打开弹框命令
     */
    export class ShowPopupCommand extends AbstractPopupCommand {

        execute(view: IView, duration: number, props: IViewProps): void {
            if (M.viewLayer.getInfoByView(view) !== null) {
                console.warn(`${view}[${view.name}] is already popup.`);
                return;
            }

            let autoDestroy: boolean = true;
            if (props.autoDestroy !== void 0) {
                autoDestroy = props.autoDestroy;
            }
            else if (view.autoDestroy !== void 0) {
                autoDestroy = view.autoDestroy;
            }
            props.autoDestroy = autoDestroy;

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
            // 第一次显示的时候，轴心点可能会不正确
            if (view instanceof Laya.View) {
                view.pivot(view.width * 0.5, view.height * 0.5);
            }
            // 避免props的默认属性不存在
            this.$makeProps(view, props);

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
                cancelAllowed: true,
                autoDestroy: autoDestroy
            };
            M.viewLayer.addToStack(info);

            M.viewLayer.addChild(mask as IView);
            M.viewLayer.addChild(view);
            M.viewLayer.onViewCreate(view, args);

            if ((props.flags & PopupFlagEnum.TRANSPARENT) === PopupFlagEnum.NONE) {
                if (props.flags & PopupFlagEnum.SYNC_FADE_TIME) {
                    Tween.get(mask, suncore.ModuleEnum.SYSTEM).from({ alpha: 0 }, duration);
                }
                else {
                    Tween.get(mask, suncore.ModuleEnum.SYSTEM).from({ alpha: 0 }, Math.min(200, duration));
                }
            }
            this.$applyShowProps(view, props, duration);
            suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, duration, this.$onPopupFinish, this, [view]);
        }

        /**
         * 缓动结束
         */
        private $onPopupFinish(view: IView): void {
            const info: IViewStackInfo = M.viewLayer.getInfoByView(view);
            if (info === null) {
                console.warn(`${view}[${view.name}] popup finish, but pop info is not exist.`);
            }
            else if (info.closed === true) {
                console.warn(`${view}[${view.name}] popup finish, but it is already closed.`);
            }
            else {
                info.displayed = true;
                M.viewLayer.onViewOpen(view);
            }
        }
    }
}