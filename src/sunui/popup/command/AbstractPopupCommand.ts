
module sunui {
    /**
     * 弹出命令基类，主要实现弹框弹出与关闭时的缓动效果
     */
    export abstract class AbstractPopupCommand extends puremvc.SimpleCommand {

        /**
         * 重组缓动信息
         */
        protected $makeProps(view: IView, props: IViewProps): void {
            if (props.x === void 0 && props.left === void 0 && props.right === void 0 && props.centerX === void 0) {
                props.centerX = 0;
            }
            if (props.y === void 0 && props.top === void 0 && props.bottom === void 0 && props.centerY === void 0) {
                switch (view.winSize) {
                    case PopupWinSizeEnum.LARGE:
                        props.y = 70;
                        break;
                    case PopupWinSizeEnum.MIDDLE:
                        props.y = 219;
                        break;
                    case PopupWinSizeEnum.SMALL:
                        props.y = 299;
                        break;
                    default:
                        props.centerY = 0;
                        break;
                }
            }
            // // 这里不确定是否这样做是合理的
            // if (suncore.System.isModuleStopped(props.mod) === true) {
            //     if (props.mod === suncore.ModuleEnum.TIMELINE && suncore.System.isModuleStopped(suncore.ModuleEnum.CUSTOM) === false) {
            //         props.mod = suncore.ModuleEnum.CUSTOM;
            //     }
            //     else {
            //         props.mod = suncore.ModuleEnum.SYSTEM;
            //     }
            // }
        }

        /**
         * 应用展示缓动
         * @props: 若props.flags存在PopupFlagEnum.SIMPLY标记，则没有缓动过程
         * @duration: 若此值为0，则亦没有缓动过程
         */
        protected $applyShowProps(view: IView, props: IViewProps, duration: number): void {
            if (props.x !== void 0) { view.x = props.x; }
            if (props.y !== void 0) { view.y = props.y; }

            if (props.centerX !== void 0) {
                view.centerX = props.centerX;
            }
            if (props.centerY !== void 0) {
                view.centerY = props.centerY;
            }
            if (view instanceof fairygui.GComponent) {
                props.centerX !== void 0 && this.$setProp(view, "centerX");
                props.centerY !== void 0 && this.$setProp(view, "centerY");
            }

            if (duration === 0 || (props.flags & PopupFlagEnum.SIMPLY) === PopupFlagEnum.SIMPLY) {
                if (props.left !== void 0) { view.left = props.left; }
                if (props.right !== void 0) { view.right = props.right; }

                if (props.top !== void 0) { view.top = props.top; }
                if (props.bottom !== void 0) { view.bottom = props.bottom; }

                if (props.scaleX !== void 0) { view.scaleX = props.scaleX; }
                if (props.scaleY !== void 0) { view.scaleY = props.scaleY; }

                if (view instanceof fairygui.GComponent) {
                    props.left !== void 0 && this.$setProp(view, "left");
                    props.right !== void 0 && this.$setProp(view, "right");

                    props.top !== void 0 && this.$setProp(view, "top");
                    props.bottom !== void 0 && this.$setProp(view, "bottom");
                }
            }
            else {
                if (props.left !== void 0) { view.left = -view.width; }
                if (props.right !== void 0) { view.right = -view.width; }

                if (props.top !== void 0) { view.top = -view.height; }
                if (props.bottom !== void 0) { view.bottom = -view.height; }

                // 若没有从任何方向缓动进入，则从中间由小变大出现
                if (props.left === void 0 && props.right === void 0 && props.top === void 0 && props.bottom === void 0) {
                    view.alpha = 0;
                    view.scaleX = 0;
                    view.scaleY = 0;

                    props.alpha = 1;
                    if (props.scaleX === void 0) { props.scaleX = 1; }
                    if (props.scaleY === void 0) { props.scaleY = 1; }
                }
                const data: any = suncom.Common.copy(props);
                if (view instanceof fairygui.GComponent) {
                    data.update = suncom.Handler.create(this, this.$applyProps, [view, data], false);
                }
                Tween.get(view, props.mod).to(data, duration, props.ease);
            }
        }

        /**
         * 应用关闭缓动
         * @props: 若props.flags存在PopupFlagEnum.SIMPLY标记，则没有缓动过程
         * @duration: 若此值为0，则亦没有缓动过程
         */
        protected $applyCloseProps(view: Laya.Sprite, props: IViewProps, duration: number): void {
            if (duration > 0 && (props.flags & PopupFlagEnum.SIMPLY) === PopupFlagEnum.NONE) {
                if (props.left !== void 0) { props.left = -view.width; }
                if (props.right !== void 0) { props.right = -view.width; }

                if (props.top !== void 0) { props.top = -view.height; }
                if (props.bottom !== void 0) { props.bottom = -view.height; }

                // 若没有从任何方向缓动滑出，则从中间由大变小消失
                if (props.left === void 0 && props.right === void 0 && props.top === void 0 && props.bottom === void 0) {
                    props.alpha = 0;
                    props.scaleX = 0;
                    props.scaleY = 0;
                }
                const data: any = suncom.Common.copy(props);
                if (view instanceof fairygui.GComponent) {
                    data.update = suncom.Handler.create(this, this.$applyProps, [view, data], false);
                }
                Tween.get(view, props.mod).to(data, duration);
            }
        }

        private $applyProps(view: IView, props: IViewProps): void {
            const keys: string[] = ["x", "y", "left", "right", "top", "bottom", "scaleX", "scaleY", "alpha", "centerX", "centerY"];
            for (let i: number = keys.length - 1; i > -1; i--) {
                const key: string = keys[i];
                if (props[key] === void 0) {
                    keys.splice(i, 1);
                }
            }

            for (const key of keys) {
                this.$setProp(view, key);
            }
        }

        private $setProp(view: IView, key: string): void {
            switch (key) {
                case "left":
                    view.x = view.left;
                    break;
                case "right":
                    view.x = suncom.Global.width - view.right;
                    break;
                case "top":
                    view.y = view.top;
                    break;
                case "bottom":
                    view.y = suncom.Global.height - view.bottom;
                    break;
                case "centerX":
                    view.x = (suncom.Global.width - view.width * view.scaleX) * 0.5 + view.centerX;
                    break;
                case "centerY":
                    view.y = (suncom.Global.height - view.height * view.scaleY) * 0.5 + view.centerY;
                    break;
            }
        }
    }
}