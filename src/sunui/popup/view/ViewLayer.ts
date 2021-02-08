
module sunui {
    /**
     * 视图层抽象类
     */
    export abstract class ViewLayer extends puremvc.Notifier {
        /**
         * 视图信息栈
         */
        private $stack: IViewStackInfo[] = [];

        constructor() {
            super();
            // 监听卸载场景事件，所有弹框应该在场景卸载之前被移除
            this.facade.registerObserver(NotifyKey.UNLOAD_SCENE, this.$onUnloadScene, this, false, suncom.EventPriorityEnum.EGL);
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
        abstract createMask(view: IView, props: IViewProps): Laya.Image | fairygui.GLoader;

        /**
         * 销毁遮罩
         */
        abstract destroyMask(mask: Laya.Image | fairygui.GLoader): void;

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
            const array: IViewStackInfo[] = this.$stack.concat();
            for (let i: number = array.length - 1; i > -1; i--) {
                const info: IViewStackInfo = array[i];
                if (info.autoDestroy === true) {
                    this.removeFromStack(info);
                }
            }
        }

        /**
         * 保存视图信息至栈中
         * NOTE: 保存时应当按UILevel从小到大的顺序排列，同级别的，后来的先处理
         */
        addToStack(newInfo: IViewStackInfo): void {
            this.$stack.push(newInfo);
        }

        /**
         * 根据视图信息直接移除视图
         */
        removeFromStack(info: IViewStackInfo): void {
            const index: number = this.$stack.indexOf(info);
            if (index < 0) {
                return;
            }
            this.$stack.splice(index, 1);

            // 被直接移的视图视为己关闭
            info.closed = true;
            this.onViewRemove(info.view);

            this.removeChild(info.view);
            this.removeChild(info.mask as IView);

            this.destroyMask(info.mask);
            if (info.keepNode === false) {
                this.destroyView(info.view);
            }
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
         * 移除视图信息
         */
        removeInfoByView(view: IView): void {
            for (let i: number = 0; i < this.$stack.length; i++) {
                const info: IViewStackInfo = this.$stack[i];
                if (info.view === view) {
                    this.removeFromStack(info);
                    break;
                }
            }
        }
    }
}