
module sunui {
    /**
     * 视图层抽象类
     */
    export abstract class ViewLayer extends puremvc.Notifier {
        /**
         * 视图信息栈
         */
        private $stack: Array<IViewStackInfo> = [];

        constructor() {
            super();
            // 监听场景被卸载消息，此消息最后被响应
            this.facade.registerObserver(NotifyKey.UNLOAD_SCENE, this.$onUnloadScene, this, false, 0);
        }

        /**
         * 添加视图到舞台
         */
        abstract addChild(view: IView): void;

        /**
         * 将视图从舞台移除
         */
        abstract removeChild(view: IView): void;

        /**
         * 创建遮罩
         */
        abstract createMask(view: IView, trans: boolean): Laya.Image;

        /**
         * 销毁遮罩
         */
        abstract destroyMask(mask: Laya.Image): void;

        /**
         * 执行视图创建成功的回调
         */
        abstract onViewCreate(view: IView, args: any): void;

        /**
         * 执行视图完成弹出的回调
         */
        abstract onViewOpen(view: IView): void;

        /**
         * 执行视图关闭被触发时的回调
         */
        abstract onViewClose(view: IView): void;

        /**
         * 执行视图从舞台上被移除时的回调（尚未移除）
         */
        abstract onViewRemove(view: IView): void;

        /**
         * 销毁视图对象
         */
        abstract destroyView(view: IView): void;

        /**
         * 场景被卸载时，应当移除所有视图
         */
        private $onUnloadScene(): void {
            const array: Array<IViewStackInfo> = this.$stack.concat();
            while (array.length > 0) {
                this.removeStackInfo(array.pop());
            }
        }

        /**
         * 根据视图信息直接移除视图
         */
        removeStackInfo(info: IViewStackInfo): void {
            const index: number = this.$stack.indexOf(info);
            if (index < 0) {
                return;
            }
            this.$stack.splice(index, 1);

            this.facade.sendNotification(NotifyKey.BEFORE_POPUP_REMOVE, info.view);
            this.onViewRemove(info.view);

            this.removeChild(info.view);
            this.removeChild(info.mask);

            if (info.keepNode === false) {
                this.destroyView(info.view);
                this.destroyMask(info.mask);
            }
            // 为了避免不同的弹框之间的销毁业务相互形成干扰，此事件被设计成在弹框对象被销毁之后被派发
            this.facade.sendNotification(NotifyKey.ON_POPUP_REMOVED, info.view);
        }

        /**
         * 获取视图信息
         */
        getInfoByView(view: IView): IViewStackInfo {
            for (let i: number = 0; i < this.$stack.length; i++) {
                const info: IViewStackInfo = this.$stack[i];
                if (info.view === view) {
                    return info;
                }
            }
            return null;
        }

        /**
         * 保存视图信息至栈中
         * NOTE: 保存时应当按UILevel从小到大的顺序排列，同级别的，后来的先处理
         */
        addToStack(newInfo: IViewStackInfo): void {
            this.$stack.push(newInfo);
        }

        /**
         * 移除视图信息
         */
        removeStackByView(view: IView): void {
            for (let i: number = 0; i < this.$stack.length; i++) {
                const info: IViewStackInfo = this.$stack[i];
                if (info.view === view) {
                    this.removeStackInfo(info);
                    break;
                }
            }
        }
    }
}