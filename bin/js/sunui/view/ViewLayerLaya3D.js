var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var sunui;
(function (sunui) {
    var ViewLayerLaya3D = /** @class */ (function (_super) {
        __extends(ViewLayerLaya3D, _super);
        function ViewLayerLaya3D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ViewLayerLaya3D.prototype.addChild = function (view) {
            sunui.M.sceneLayer.uiScene.addChild(view);
        };
        ViewLayerLaya3D.prototype.addChildAt = function (view, index) {
            sunui.M.sceneLayer.uiScene.addChildAt(view, index);
        };
        ViewLayerLaya3D.prototype.removeChild = function (view) {
            sunui.M.sceneLayer.uiScene.removeChild(view);
        };
        ViewLayerLaya3D.prototype.removeChildAt = function (index) {
            sunui.M.sceneLayer.uiScene.removeChildAt(index);
        };
        ViewLayerLaya3D.prototype.createMask = function (view) {
            var mask = new Laya.Image("game/mask.png");
            mask.left = mask.right = mask.top = mask.bottom = 0;
            mask.sizeGrid = "1,1,1,1";
            mask.alpha = 0.5;
            mask.mouseEnabled = true;
            mask.mouseThrough = false;
            return mask;
        };
        ViewLayerLaya3D.prototype.onViewCreate = function (view, args) {
            var node = view;
            var components = node.getComponents(Laya.Component) || [];
            for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
                var component = components_1[_i];
                if (component.$onCreate) {
                    if (args instanceof Array) {
                        component.$onCreate.apply(component, args);
                    }
                    else {
                        component.$onCreate.call(component, args);
                    }
                }
            }
        };
        ViewLayerLaya3D.prototype.onViewOpen = function (view) {
            var node = view;
            var components = node.getComponents(Laya.Component) || [];
            for (var _i = 0, components_2 = components; _i < components_2.length; _i++) {
                var component = components_2[_i];
                if (component.$onOpen) {
                    component.$onOpen.call(component);
                }
            }
        };
        ViewLayerLaya3D.prototype.onViewClose = function (view) {
            var node = view;
            var components = node.getComponents(Laya.Component) || [];
            for (var _i = 0, components_3 = components; _i < components_3.length; _i++) {
                var component = components_3[_i];
                if (component.$onClose) {
                    component.$onClose.call(component);
                }
            }
        };
        ViewLayerLaya3D.prototype.onViewRemove = function (view) {
            var node = view;
            var components = node.getComponents(Laya.Component) || [];
            for (var _i = 0, components_4 = components; _i < components_4.length; _i++) {
                var component = components_4[_i];
                if (component.$onRemove) {
                    component.$onRemove.call(component);
                }
            }
        };
        ViewLayerLaya3D.prototype.destroyMask = function (mask) {
            var temp = mask;
            temp.destroy();
        };
        ViewLayerLaya3D.prototype.createViewByClass = function (cls) {
            if (typeof cls === "string") {
                var prefab = new Laya.Prefab();
                prefab.json = Laya.Loader.getRes(cls);
                return prefab.create();
            }
            else {
                return new cls();
            }
        };
        ViewLayerLaya3D.prototype.destroyView = function (view) {
            var temp = view;
            temp.destroy();
        };
        return ViewLayerLaya3D;
    }(sunui.ViewLayer));
    sunui.ViewLayerLaya3D = ViewLayerLaya3D;
})(sunui || (sunui = {}));
//# sourceMappingURL=ViewLayerLaya3D.js.map