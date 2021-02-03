
module sunui {
    /**
     * 视图层（Laya）
     */
    export class ViewLayerLayaFui extends ViewLayer {

        /**
         * 添加视图到舞台
         */
        addChild(view: IView): void {
            const node: fairygui.GComponent = view as any;
            fairygui.GRoot.inst.addChild(node);
        }

        /**
         * 将视图从舞台移除
         */
        removeChild(view: IView): void {
            const node: fairygui.GComponent = view as any;
            const parent: fairygui.GComponent = node.parent || null;
            if (parent === null) {
                throw Error(`无法移除显示对象，因为父节点不存在 ${node.name}`);
            }
            fairygui.GRoot.inst.removeChild(node);
        }

        /**
         * 创建遮罩
         */
        createMask(view: IView, props: IViewProps): fairygui.GLoader {
            const mask: fairygui.GLoader = new fairygui.GLoader();
            mask.url = "ui://Public_Resource/B_bantoumingbeijing";
            mask.fill = fairygui.LoaderFillType.ScaleFree;
            mask.setSize(suncom.Global.width, suncom.Global.height);

            if (props.flags & PopupFlagEnum.TRANSPARENT) {
                mask.alpha = 0;
            }
            else {
                mask.alpha = 1;
            }
            if ((props.flags & PopupFlagEnum.MOUSE_THROUGH) === PopupFlagEnum.NONE) {
                mask.on(Laya.Event.CLICK, this, this.$onMaskClick, [view]);
            }
            else {
                mask.touchable = false;
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
            mask.dispose();
        }

        /**
         * 销毁视图对象
         */
        destroyView(view: IView): void {
            const node: fairygui.GComponent = view as any;
            node.dispose();
        }

        /**
         * 执行视图创建成功的回调
         */
        onViewCreate(view: IView, args: any): void {
            const init: Function = view["init"];
            init && init.call(view, args);
        }

        /**
         * 执行视图完成弹出的回调
         */
        onViewOpen(view: IView): void {
            const onOpen: Function = view["onOpen"];
            onOpen && onOpen.call(view);
        }

        /**
         * 执行视图关闭被触发时的回调
         */
        onViewClose(view: IView): void {
            const onClose: Function = view["onClose"];
            onClose && onClose.call(view);
        }

        /**
         * 执行视图从舞台上被移除时的回调（尚未移除）
         */
        onViewRemove(view: IView): void {
            const onRemove: Function = view["onRemove"];
            onRemove && onRemove.call(view);
        }
    }
}