
module sunui {
    /**
     * 视图层抽象类
     */
    export abstract class ViewLayer extends puremvc.Notifier {
        /**
         * 视图栈信息
         */
        private $infos: Array<IViewStackInfo> = [];

        constructor() {
            super();
            // 监听场景被卸载消息，此消息最后被响应
            this.facade.registerObserver(NotifyKey.UNLOAD_SCENE, this.$onUnloadScene, this, false, 0);
        }

        abstract addChild(view: IView): void;

        abstract addChildAt(view: IView, index: number): void;

        abstract removeChild(view: IView): void;

        abstract removeChildAt(index: number): void;

        abstract createMask(view: IView): IView;

        abstract destroyMask(mask: IView): void;

        /**
         * 不同的平台中，实现的方法不一样
         */
        abstract createViewByClass(cls: string | (new () => IView)): IView;

        abstract onViewCreate(view: IView, args: any): void;

        abstract onViewOpen(view: IView): void;

        abstract onViewClose(view: IView): void;

        abstract onViewRemove(view: IView): void;

        abstract destroyView(view: IView): void;

        /**
         * 场景被卸载时，应当移除所有视图
         */
        private $onUnloadScene(): void {
            const array: Array<IViewStackInfo> = this.$infos.concat();
            while (array.length > 0) {
                this.removeStackByInfo(array.pop());
            }
        }

        /**
         * 根据视图信息直接移除视图
         */
        removeStackByInfo(info: IViewStackInfo): void {
            const index: number = this.$infos.indexOf(info);
            if (index < 0) {
                return;
            }
            this.$infos.splice(index, 1);
            this.onViewRemove(info.view);

            this.removeChild(info.view);
            this.removeChild(info.mask);

            if (info.keepNode == false) {
                this.facade.sendNotification(NotifyKey.BEFORE_POPUP_REMOVED, info.view);
                this.destroyMask(info.mask);
                this.destroyView(info.view);
            }
            // 为了避免不同的弹框之间的销毁业务相互形成干扰，此事件被设计成在弹框对象被销毁之后被派发
            this.facade.sendNotification(NotifyKey.ON_POPUP_REMOVED, info.view);
        }

        /**
         * 判断是否存在指定层级的视图
         */
        isViewExistInLevel(level: UILevel): boolean {
            for (let i: number = 0; i < this.$infos.length; i++) {
                const info: IViewStackInfo = this.$infos[i];
                if (info.closed === false && info.level === level) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 获取当前第一个活动的视图信息
         */
        getActiveViewInfo(): IViewStackInfo {
            for (let i: number = this.$infos.length - 1; i > -1; i--) {
                const info: IViewStackInfo = this.$infos[i];
                if (info.closed == false) {
                    return info;
                }
            }
            return null;
        }

        /**
         * 根据视图获取弹出信息
         */
        getInfoByView(view: IView): IViewStackInfo {
            for (let i: number = this.$infos.length - 1; i > -1; i--) {
                const info: IViewStackInfo = this.$infos[i];
                if (info.view === view) {
                    return info;
                }
            }
            return null;
        }

        /**
         * 将视图信息保存至视图栈中
         * NOTE: 保存时应当按UILevel从小到大的顺序排列，同级别的，后来的先处理
         */
        addStack(newInfo: IViewStackInfo): void {
            let index: number = -1;
            for (let i: number = 0; i < this.$infos.length; i++) {
                const info: IViewStackInfo = this.$infos[i];
                if (index == -1 && info.level > newInfo.level) {
                    index = i;
                    break;
                }
            }
            if (index == -1) {
                this.$infos.push(newInfo);
            }
            else {
                this.$infos.splice(index, 0, newInfo);
            }
        }

        /**
         * 根据视图对象移除视图信息
         */
        removeStackByView(view: IView): void {
            for (let i: number = this.$infos.length - 1; i > -1; i--) {
                const info: IViewStackInfo = this.$infos[i];
                if (info.view == view) {
                    this.removeStackByInfo(info);
                    break;
                }
            }
        }

        /**
         * 根据视图类型移除视图
         */
        removeStackByViewClass(viewClass: new () => IView): void {
            const array: Array<IViewStackInfo> = [];
            for (let i: number = 0; i < this.$infos.length; i++) {
                const info: IViewStackInfo = this.$infos[i];
                if (info.viewClass == viewClass) {
                    array.push(info);
                }
            }
            while (array.length > 0) {
                this.removeStackByInfo(array.pop());
            }
        }

        /**
         * 是否存在指定类型的视图
         * @viewClass: 视图类型
         * NOTE: 若参数为空，则返回是否存在弹出视图
         */
        hasView(viewClass: new () => IView): boolean {
            for (let i: number = 0; i < this.$infos.length; i++) {
                const info: IViewStackInfo = this.$infos[i];
                // 忽略己关闭的弹框
                if (info.closed == true) {
                    continue;
                }
                if (info.viewClass === viewClass) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 显示新视图
         * @viewClass: 视图类型
         * @args: 参数列表
         * @props: 视图属性
         */
        showView(viewClass: any, args?: any, props: IViewProps = {}): IView {
            // 修正参数
            if (props.cancelAllowed === void 0) { props.cancelAllowed = true; }

            const cancelAllowed: boolean = props.cancelAllowed;

            delete props.cancelAllowed;

            // 创建视图
            const view: IView = this.createViewByClass(viewClass);

            // 补充属性
            props.args = args;
            props.keepNode = false;
            props.viewClass = viewClass;

            // 执行弹出逻辑
            new ViewFacade(view).popup(props).cancelAllowed = cancelAllowed;

            return view;
        }

        /**
         * 关闭当前视图
         */
        closeView(view: IView): void {
            new ViewFacade(view).close();
        }

        /**
         * 判断当前视图是否允许取消
         */
        get isCurrentViewCancelAllowed(): boolean {
            const info: IViewStackInfo = this.getActiveViewInfo();
            if (info != null && info.cancelAllowed === true) {
                return true;
            }
            return false;
        }
    }
}