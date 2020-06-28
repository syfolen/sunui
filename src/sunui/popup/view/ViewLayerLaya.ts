
module sunui {
    /**
     * 视图层（Laya）
     */
    export abstract class ViewLayerLaya extends ViewLayer {

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
         * 销毁视图对象
         */
        destroyView(view: IView): void {
            const node: Laya.Node = view as any;
            node.destroy();
        }
    }
}