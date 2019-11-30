
module sunui {
    /**
     * export
     */
    export class UIManager extends puremvc.Notifier {
        /**
         * 单例对象
         */
        private static $inst: UIManager = null;

        /**
         * export
         */
        static getInstance(): UIManager {
            if (UIManager.$inst == null) {
                UIManager.$inst = new UIManager();
            }
            return UIManager.$inst;
        }

        /**
         * 弹框命令应当在此处被注册
         */
        constructor() {
            super();
            M.viewLayer = new ViewLayerLaya3D();
            M.sceneLayer = new SceneLayer();
            this.facade.registerCommand(NotifyKey.SHOW_POPUP, ShowPopupCommand);
            this.facade.registerCommand(NotifyKey.CLOSE_POPUP, ClosePopupCommand);
        }

        /**
         * 进入新场景，并将当前场景压入历史
         * @data: 参数对象，保存在此对象中的数据的生命周期与场景历史的生命周期一致，当场景存在于当前或存在于历史时，数据就不会被销毁
         * export
         */
        enterScene(name: number, data?: any): void {
            M.sceneLayer.enterScene(name, data);
        }

        /**
         * 退出当前场景，并返回历史
         * export
         */
        exitScene(): void {
            M.sceneLayer.exitScene();
        }

        /**
         * 替换当前场景
         * @data: 参数说明请参考enterScene方法的注释
         * 说明：被替换的场景不会进入历史
         * export
         */
        replaceScene(name: number, data?: any): void {
            M.sceneLayer.replaceScene(name, data);
        }

        /**
         * 是否存在指定类型的视图
         * @viewClass:视图类型
         */
        hasView(viewClass?: new () => IView): boolean {
            return M.viewLayer.hasView(viewClass);
        }

        /**
         * 显示普通类型视图
         */
        showView(viewClass: new () => IView, args?: any, props: IViewProps = {}): void {
            props.level = UILevel.POPUP;
            M.viewLayer.showView(viewClass, args, props);
        }

        /**
         * 关闭普通类型视图
         */
        closeView(view: IView): void {
            M.viewLayer.closeView(view);
        }

        /**
         * 移除普通类型视图
         */
        removeView(view: IView): void {
            M.viewLayer.removeStackByView(view);
        }

        /**
         * 根据视图类型移除视图
         */
        removeViewByClass(viewClass: any): void {
            M.viewLayer.removeStackByViewClass(viewClass);
        }

        /**
         * 获取场景对象
         * export
         */
        get uiScene(): Laya.Scene {
            return M.sceneLayer.uiScene;
        }

        /**
         * 获取场景对象
         * export
         */
        get d3Scene(): Laya.Scene3D {
            return M.sceneLayer.d3Scene;
        }

        /**
         * 获取场景名字
         * export
         */
        get sceneName(): number {
            return M.sceneLayer.sceneName;
        }
    }
}