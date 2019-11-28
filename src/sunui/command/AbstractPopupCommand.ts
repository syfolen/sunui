
module sunui {

    export abstract class AbstractPopupCommand extends puremvc.SimpleCommand {

        /**
         * 重组缓动信息
         */
        protected $makeProps(props: IViewProps): IViewProps {
            // 水平默认居中
            if (props.x === void 0 && props.left === void 0 && props.right === void 0) {
                props.centerX = 0;
            }
            // 垂直默认居中
            if (props.y === void 0 && props.top === void 0 && props.bottom === void 0) {
                props.centerY = 0;
            }
            return props;
        }

        /**
         * 应用展示缓动
         * @duration: 若此值为0，则没有缓动过程
         */
        protected $applyShowProps(view: IView, props: IViewProps, duration: number): void {
            // 应用坐标
            if (props.x !== void 0) { view.x = props.x; }
            if (props.y !== void 0) { view.y = props.y; }

            // 应用对齐方式
            if (props.centerX !== void 0) { view.centerX = props.centerX; }
            if (props.centerY !== void 0) { view.centerY = props.centerY; }

            // 没有缓动
            if (duration == 0) {
                if (props.left !== void 0) { view.left = props.left; }
                if (props.right !== void 0) { view.right = props.right; }

                if (props.top !== void 0) { view.top = props.top; }
                if (props.bottom !== void 0) { view.bottom = props.bottom; }
            }
            else {
                // 从左或右滑入
                if (props.left !== void 0) { view.left = -view.width; }
                if (props.right !== void 0) { view.right = -view.width; }

                // 从上或下滑入
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

                Tween.get(view, suncore.ModuleEnum.CUSTOM).to(props, duration, props.ease);
            }
        }

        /**
         * 应用关闭缓动
         * @duration: 若此值为0，则没有缓动过程
         */
        protected $applyCloseProps(view: IView, props: IViewProps, duration: number): void {
            // 只有在缓动时间大于0时才会执行缓动
            if (duration > 0) {
                // 从左或右滑出
                if (props.left !== void 0) { props.left = -view.width; }
                if (props.right !== void 0) { props.right = -view.width; }

                // 从上或下滑出
                if (props.top !== void 0) { props.top = -view.height; }
                if (props.bottom !== void 0) { props.bottom = -view.height; }

                // 若没有从任何方向缓动滑出，则从中间由大变小消失
                if (props.left === void 0 && props.right === void 0 && props.top === void 0 && props.bottom === void 0) {
                    props.alpha = 0;
                    props.scaleX = 0;
                    props.scaleY = 0;
                }

                Tween.get(view, suncore.ModuleEnum.CUSTOM).to(props, duration);
            }
        }
    }
}