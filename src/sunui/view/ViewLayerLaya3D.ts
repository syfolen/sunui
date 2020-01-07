
module sunui {

    export class ViewLayerLaya3D extends ViewLayer {

        addChild(view: sunui.IView): void {
            const child: Laya.Node = view as any;
            const parent: Laya.Node = M.sceneLayer.uiScene || Laya.stage;
            parent.addChild(child);
        }

        removeChild(view: sunui.IView): void {
            const child: Laya.Node = view as any;
            const parent: Laya.Node = child.parent || null;
            if (parent === null) {
                throw Error(`无法移除显示对象，因为父节点不存在 ${child.name}`);
            }
            parent.removeChild(child);
        }

        createMask(view: sunui.IView): sunui.IView {
            const mask: Laya.Image = new Laya.Image("common/mask.png");
            mask.left = mask.right = mask.top = mask.bottom = 0;
            mask.sizeGrid = "1,1,1,1";
            mask.alpha = 0.5;
            mask.mouseEnabled = true;
            mask.mouseThrough = false;
            return mask as sunui.IView;
        }

        onViewCreate(view: sunui.IView, args: any): void {
            const node: any = view;
            const components: sunui.IPopupView[] = node.getComponents(Laya.Component) || [];
            for (const component of components) {
                if (component.$onCreate) {
                    if (args instanceof Array) {
                        component.$onCreate.apply(component, args);
                    }
                    else {
                        component.$onCreate.call(component, args);
                    }
                }
            }
        }

        onViewOpen(view: sunui.IView): void {
            const node: any = view;
            const components: sunui.IPopupView[] = node.getComponents(Laya.Component) || [];
            for (const component of components) {
                if (component.$onOpen) {
                    component.$onOpen.call(component);
                }
            }
        }

        onViewClose(view: sunui.IView): void {
            const node: any = view;
            const components: sunui.IPopupView[] = node.getComponents(Laya.Component) || [];
            for (const component of components) {
                if (component.$onClose) {
                    component.$onClose.call(component);
                }
            }
        }

        onViewRemove(view: sunui.IView): void {
            const node: any = view;
            const components: sunui.IPopupView[] = node.getComponents(Laya.Component) || [];
            for (const component of components) {
                if (component.$onRemove) {
                    component.$onRemove.call(component);
                }
            }
        }

        destroyMask(view: sunui.IView): void {
            const mask: Laya.Image = view as any;
            mask.destroy();
        }

        createViewByClass(cls: string | (new () => IView)): sunui.IView {
            if (typeof cls === "string") {
                const prefab: Laya.Prefab = new Laya.Prefab();
                prefab.json = Laya.Loader.getRes(cls);
                return prefab.create();
            }
            else {
                return new cls();
            }
        }

        destroyView(view: sunui.IView): void {
            const node = view as any;
            node.destroy();
        }
    }
}