
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
         * 注册sunui模块
         * export
         */
        register(): void {
            M.viewLayer = new ViewLayerLaya3D();
            M.sceneLayer = new SceneLayer();
            this.facade.registerCommand(NotifyKey.SHOW_POPUP, ShowPopupCommand);
            this.facade.registerCommand(NotifyKey.CLOSE_POPUP, ClosePopupCommand);
        }

        /**
         * 注销sunui模块
         * export
         */
        unregister(): void {
            this.facade.removeCommand(NotifyKey.SHOW_POPUP);
            this.facade.removeCommand(NotifyKey.CLOSE_POPUP);
            M.viewLayer = null;
            M.sceneLayer = null;
        }

        /**
         * 进入新场景，并将当前场景压入历史
         * @args: 参数列表，场景参数列表在进入下一个场景时会自动被保存，在返回场景时会被重新传入，在返回上一个场景时被丢弃
         * export
         */
        enterScene(name: number, args?: any): void {
            M.sceneLayer.enterScene(name, args);
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
         * 说明：被替换的场景不会进入历史
         * export
         */
        replaceScene(name: number, args?: any): void {
            M.sceneLayer.replaceScene(name, args);
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
    }
}