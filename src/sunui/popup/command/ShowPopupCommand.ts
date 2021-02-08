
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
            if (props.ease === void 0) { props.ease = Laya.Ease.backOut; }
            if (props.flags === void 0) { props.flags = PopupFlagEnum.NONE; }
            if (props.keepNode === void 0) { props.keepNode = false; }

            let autoDestroy: boolean = true;
            if (props.autoDestroy !== void 0) {
                autoDestroy = props.autoDestroy;
            }
            else if (view.autoDestroy !== void 0) {
                autoDestroy = view.autoDestroy;
            }
            props.autoDestroy = autoDestroy;

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

            const mod: suncore.ModuleEnum = autoDestroy === true ? suncore.ModuleEnum.CUSTOM : suncore.ModuleEnum.SYSTEM;
            if ((props.flags & PopupFlagEnum.TRANSPARENT) === PopupFlagEnum.NONE) {
                if (props.flags & PopupFlagEnum.SYNC_FADE_TIME) {
                    Tween.get(mask, mod).from({ alpha: 0 }, duration);
                }
                else {
                    Tween.get(mask, mod).from({ alpha: 0 }, Math.min(200, duration));
                }
            }
            this.$applyShowProps(view, props, duration);
            suncore.System.addTimer(mod, duration, this.$onPopupFinish, this, [info, view]);
        }

        /**
         * 缓动结束
         */
        private $onPopupFinish(info: IViewStackInfo, view: IView): void {
            if (info.closed === false) {
                info.displayed = true;
                M.viewLayer.onViewOpen(view);
            }
        }
    }
}