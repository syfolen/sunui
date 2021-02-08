/**
 * @license sunui (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the MIT License
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/sunui
 * export
 */
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
            if (UIManager.$inst === null) {
                UIManager.$inst = new UIManager();
            }
            return UIManager.$inst;
        }

        /**
         * 弹框命令应当在此处被注册
         */
        constructor() {
            super();
            M.sceneLayer = new SceneLayer();
            // if (Laya.Scene3D === void 0) {
            //     M.viewLayer = new ViewLayerLaya2D();
            // }
            // else {
            //     M.viewLayer = new ViewLayerLaya3D();
            // }
            M.viewLayer = new ViewLayerLayaFui();

            // 启动缓动服务
            suncom.DBService.put(-1, new TweenService()).run();
            // 启动资源加载管理服务
            suncom.DBService.put(-1, new LoadingService()).run();

            this.facade.registerCommand(NotifyKey.SHOW_POPUP, ShowPopupCommand, suncom.EventPriorityEnum.OSL);
            this.facade.registerCommand(NotifyKey.CLOSE_POPUP, ClosePopupCommand, suncom.EventPriorityEnum.OSL);
        }

        /**
         * 进入新场景，并将当前场景压入历史
         * @data: 参数对象，保存在此对象中的数据的生命周期与场景历史的生命周期一致，当场景存在于当前或存在于历史时，数据就不会被销毁
         * export
         */
        enterScene(name: number, data?: any): void {
            puremvc.MutexLocker.backup(this);
            M.sceneLayer.enterScene(name, data);
            puremvc.MutexLocker.restore();
        }

        /**
         * 退出当前场景，并返回历史
         * export
         */
        exitScene(): void {
            puremvc.MutexLocker.backup(this);
            M.sceneLayer.exitScene();
            puremvc.MutexLocker.restore();
        }

        /**
         * 替换当前场景
         * @data: 参数说明请参考enterScene方法的注释
         * 说明：被替换的场景不会进入历史
         * export
         */
        replaceScene(name: number, data?: any): void {
            puremvc.MutexLocker.backup(this);
            M.sceneLayer.replaceScene(name, data);
            puremvc.MutexLocker.restore();
        }

        /**
         * 删除历史
         * @deleteCount: 需要删除的历史场景个数
         * export
         */
        deleteHistories(deleteCount: number): void {
            M.sceneLayer.deleteHistories(deleteCount);
        }

        /**
         * 移除视图
         * export
         */
        removeView(view: any): void {
            M.viewLayer.removeInfoByView(view);
        }

        /**
         * 场景是否己就绪
         * export
         */
        get ready(): boolean {
            return M.sceneLayer.ready;
        }

        /**
         * 获取2D场景对象
         * export
         */
        get scene2d(): Laya.Scene | fairygui.GComponent {
            return M.sceneLayer.scene2d;
        }

        /**
         * 获取3D场景对象
         * export
         */
        get scene3d(): Laya.Scene3D {
            return M.sceneLayer.scene3d;
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