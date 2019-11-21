
module sunui {
    /**
     * export
     */
    export class UIManager {

        private static inst: UIManager = null;

        /**
         * export
         */
        static getInstance(): UIManager {
            if (UIManager.inst == null) {
                UIManager.inst = new UIManager();
            }
            return UIManager.inst;
        }

        viewLayer: ViewLayer;
        sceneLayer: SceneLayer;

        baseViewClass: new () => any;
        baseSceneClass: new () => any;

        /**
         * 注册视图层
         * export
         */
        regViewLayer(layer: ViewLayer): void {
            this.viewLayer = layer;
        }

        /**
         * 注册场景层
         * export
         */
        regSceneLayer(layer: SceneLayer): void {
            this.sceneLayer = layer;
        }

        /**
         * 注册视图基类
         */
        regBaseViewClass(cls: new () => any): void {
            this.baseViewClass = cls;
        }

        /**
         * 注册场景基类
         */
        regBaseSceneClass(cls: new () => any): void {
            this.baseSceneClass = cls;
        }

        ////////////////////////////////////////////////////////////////////////////////////////
        // 场景相关

        /**
         * 进入新场景，并将当前场景压入历史
         * export
         */
        enterScene(name: number, args?: any): void {
            this.sceneLayer.enterScene(name, args);
        }

        /**
         * 退出当前场景，并返回历史
         * export
         */
        exitScene(): void {
            this.sceneLayer.exitScene();
        }

        /**
         * 替换当前场景
         * 说明：被替换的场景不会进入历史
         * export
         */
        replaceScene(name: number, args?: any): void {
            this.sceneLayer.replaceScene(name, args);
        }

        /**
         * 判断当前场景是否为指定类型的场景
         */
        isCurrentSceneMatch(sceneClass: new () => any): boolean {
            return this.sceneLayer.isCurrentSceneMatch(sceneClass);
        }

        /**
         * 获取场景对象
         * export
         */
        get uiScene(): Laya.Scene {
            return this.sceneLayer.uiScene;
        }

        /**
         * 获取场景对象
         * export
         */
        get d3Scene(): Laya.Scene3D {
            return this.sceneLayer.d3Scene;
        }

        ////////////////////////////////////////////////////////////////////////////////////////
        // 视图相关

        /**
         * 是否存在指定类型的视图
         * @viewClass:视图类型
         */
        hasView(viewClass?: new () => IView): boolean {
            return this.viewLayer.hasView(viewClass);
        }

        /**
         * 显示普通类型视图
         */
        showView(viewClass: new () => IView, args?: any, props: IViewProps = {}): void {
            props.level = UILevel.VIEW;
            this.viewLayer.showView(viewClass, args, props);
        }

        /**
         * 关闭普通类型视图
         */
        closeView(view: IView): void {
            this.viewLayer.closeView(view);
        }

        /**
         * 移除普通类型视图
         */
        removeView(view: IView): void {
            this.viewLayer.removeStackByView(view);
        }

        /**
         * 根据视图类型移除视图
         */
        removeViewByClass(viewClass: any): void {
            this.viewLayer.removeStackByViewClass(viewClass);
        }

        /**
         * 显示PANEL类型的视图
         */
        showPanel(viewClass: any, args?: any, props: IViewProps = {}): void {
            props.level = UILevel.PANEL;
            this.viewLayer.showView(viewClass, args, props);
        }

        /**
         * 显示POPUP类型视图
         */
        showPopup(viewClass: new () => IView, args?: any, props: IViewProps = {}): void {
            props.level = UILevel.POPUP;
            this.viewLayer.showView(viewClass, args, props);
        }

        /**
         * 显示TOP类型视图
         */
        showTopView(viewClass: new () => IView, args?: any, props: IViewProps = {}): void {
            props.level = UILevel.TOP;
            this.viewLayer.showView(viewClass, args, props);
        }

        /**
         * 根据消息内容获取提示框
         */
        searchPopupViewByMessage(message: string): IView {
            return this.viewLayer.searchPopupViewByMessage(message);
        }
    }
}