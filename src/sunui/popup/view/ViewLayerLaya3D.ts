
module sunui {
    /**
     * 视图层（Laya2.x）
     */
    export class ViewLayerLaya3D extends ViewLayerLaya {

        /**
         * 执行视图创建成功的回调
         */
        onViewCreate(view: IView, args: any): void {
            const components: IPopupView[] = (view as any).getComponents(Laya.Component) || [];
            for (let i: number = 0; i < components.length; i++) {
                const component: IPopupView = components[i];
                if (component.$onCreate) {
                    if (args instanceof Array === false) {
                        component.$onCreate.call(component, args);
                    }
                    else {
                        component.$onCreate.apply(component, args);
                    }
                }
            }
        }

        /**
         * 执行视图完成弹出的回调
         */
        onViewOpen(view: IView): void {
            const components: IPopupView[] = (view as any).getComponents(Laya.Component) || [];
            for (let i: number = 0; i < components.length; i++) {
                const component: IPopupView = components[i];
                if (component.$onOpen) {
                    component.$onOpen.call(component);
                }
            }
        }

        /**
         * 执行视图关闭被触发时的回调
         */
        onViewClose(view: IView): void {
            const components: IPopupView[] = (view as any).getComponents(Laya.Component) || [];
            for (let i: number = 0; i < components.length; i++) {
                const component: IPopupView = components[i];
                if (component.$onClose) {
                    component.$onClose.call(component);
                }
            }
        }

        /**
         * 执行视图从舞台上被移除时的回调（尚未移除）
         */
        onViewRemove(view: IView): void {
            const components: IPopupView[] = (view as any).getComponents(Laya.Component) || [];
            for (let i: number = 0; i < components.length; i++) {
                const component: IPopupView = components[i];
                if (component.$onRemove) {
                    component.$onRemove.call(component);
                }
            }
        }
    }
}