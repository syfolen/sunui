
module sunui {
    /**
     * 弹出命令基类，主要实现弹框弹出与关闭时的缓动效果
     */
    export abstract class AbstractPopupCommand extends puremvc.SimpleCommand {

        /**
         * 重组缓动信息
         */
        protected $makeProps(props: IViewProps): void {
            if (props.x === void 0 && props.left === void 0 && props.right === void 0) {
                props.centerX = 0;
            }
            if (props.y === void 0 && props.top === void 0 && props.bottom === void 0) {
                props.centerY = 0;
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

            if (props.centerX !== void 0) { view.centerX = props.centerX; }
            if (props.centerY !== void 0) { view.centerY = props.centerY; }

            if (duration === 0 || (props.flags & PopupFlagEnum.SIMPLY)) {
                if (props.left !== void 0) { view.left = props.left; }
                if (props.right !== void 0) { view.right = props.right; }

                if (props.top !== void 0) { view.top = props.top; }
                if (props.bottom !== void 0) { view.bottom = props.bottom; }
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
                    props.scaleX = 1;
                    props.scaleY = 1;
                }
                Tween.get(view, props.mod).to(props, duration, props.ease);
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
                Tween.get(view, props.mod).to(props, duration);
            }
        }
    }
}