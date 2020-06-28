
module sunui {
    /**
     * 视图层（Laya1.x）
     */
    export class ViewLayerLaya2D extends ViewLayerLaya {

        /**
         * 执行视图创建成功的回调
         */
        onViewCreate(view: IView, args: any): void {
            const node: IPopupView = view as any;
            if (node.$onCreate) {
                if (args instanceof Array === false) {
                    node.$onCreate.call(node, args);
                }
                else {
                    node.$onCreate.apply(node, args);
                }
            }
        }

        /**
         * 执行视图完成弹出的回调
         */
        onViewOpen(view: IView): void {
            const node: IPopupView = view as any;
            if (node.$onOpen) {
                node.$onOpen.call(node);
            }
        }

        /**
         * 执行视图关闭被触发时的回调
         */
        onViewClose(view: IView): void {
            const node: IPopupView = view as any;
            if (node.$onClose) {
                node.$onClose.call(node);
            }
        }

        /**
         * 执行视图从舞台上被移除时的回调（尚未移除）
         */
        onViewRemove(view: IView): void {
            const node: IPopupView = view as any;
            if (node.$onRemove) {
                node.$onRemove.call(node);
            }
        }
    }
}