
module sunui {
    /**
     * 视图层（Laya2.x）
     */
    export class ViewLayerLaya3D extends ViewLayer {

        /**
         * 添加视图到舞台
         */
        addChild(view: IView): void {
            const node: Laya.Node = view as any;
            if (M.sceneLayer.scene2d === null || view.zOrder >= sunui.UILevel.LOADING) {
                Laya.stage.addChild(node);
            }
            else {
                M.sceneLayer.scene2d.addChild(node);
            }
        }

        /**
         * 将视图从舞台移除
         */
        removeChild(view: IView): void {
            const node: Laya.Node = view as any;
            const parent: Laya.Node = node.parent || null;
            if (parent === null) {
                throw Error(`无法移除显示对象，因为父节点不存在 ${node.name}`);
            }
            parent.removeChild(node);
        }

        /**
         * 创建遮罩
         */
        createMask(view: IView, props: IViewProps): Laya.Image {
            const mask: Laya.Image = new Laya.Image("common/mask_b.png");
            mask.left = mask.right = mask.top = mask.bottom = 0;
            mask.sizeGrid = "1,1,1,1";

            if (props.flags & PopupFlagEnum.TRANSPARENT) {
                mask.alpha = 0;
            }
            else {
                mask.alpha = 1;
            }
            if ((props.flags & PopupFlagEnum.MOUSE_THROUGH) === PopupFlagEnum.NONE) {
                mask.mouseThrough = false;
                mask.on(Laya.Event.CLICK, this, this.$onMaskClick, [view]);
            }

            return mask;
        }

        /**
         * 弹框背景点击回调
         */
        private $onMaskClick(view: IView): void {
            const info: IViewStackInfo = M.viewLayer.getInfoByView(view);
            if (info !== null && info.closed === false && info.cancelAllowed === true) {
                new ViewFacade(view).close();
            }
        }

        /**
         * 销毁遮罩
         */
        destroyMask(mask: Laya.Image): void {
            mask.off(Laya.Event.CLICK, this, this.$onMaskClick);
            mask.destroy();
        }

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

        /**
         * 销毁视图对象
         */
        destroyView(view: IView): void {
            const node: Laya.Node = view as any;
            node.destroy();
        }
    }
}