
module sunui {

    export abstract class ViewLayer {
        /**
         * 视图栈信息
         */
        private $infos: Array<IViewStackInfo> = [];

        constructor() {
            // 监听场景被卸载消息，此消息应当优先被响应
            puremvc.Facade.getInstance().registerObserver(NotifyKey.UNLOAD_SCENE, this.$onUnloadScene, this, false, 5);
        }

        abstract addChild(view: IView): void;

        abstract addChildAt(view: IView, index: number): void;

        abstract removeChild(view: IView): void;

        abstract removeChildAt(index: number): void;

        abstract createMask(view: IView): IView;

        abstract destroyMask(mask: IView): void;

        abstract createViewByClass(cls: new () => IView): IView;

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
         * 是否存在TOP类型的视图
         */
        hasTopView(): boolean {
            const info: IViewStackInfo = this.getActiveViewInfo();
            if (info != null && info.level == UILevel.TOP) {
                return true;
            }
            return false;
        }

        /**
         * 根据视图获取弹出信息
         */
        getInfoByView(view: IView): IViewStackInfo {
            for (let i: number = this.$infos.length - 1; i > -1; i--) {
                const info: IViewStackInfo = this.$infos[i];
                if (info.view == view) {
                    return info;
                }
            }
            return null;
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
         * 获取上一个背景不通透的节点
         */
        returnLatestStackNotTrans(view: IView): IViewStackInfo {
            for (let i: number = this.$infos.length - 1; i > -1; i--) {
                const info: IViewStackInfo = this.$infos[i];
                if (info.view == view || info.trans == true) {
                    continue;
                }
                return info;
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
         * 根据视图信息直接移除视图
         */
        removeStackByInfo(info: IViewStackInfo): void {
            const index: number = this.$infos.indexOf(info);
            if (index < 0) {
                return;
            }
            this.$infos.splice(index, 1);

            const popup: IPopupView = info.view as IPopupView;
            popup.$onRemove && popup.$onRemove();

            this.removeChild(info.mask);
            this.removeChild(info.view);

            if (info.keepNode == false) {
                this.destroyView(info.view);
            }

            // 若被移除的弹框背景不为通透，则需要找一个不通透的节点，将背景置为不通透
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
                if (viewClass !== void 0) {
                    if (info.viewClass == viewClass) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
            return false;
        }

        /**
         * 显示新视图，若需要，则隐藏当前视图
         * @viewClass: 视图类型
         * @args: 参数列表
         * @props: 视图属性
         */
        showView(viewClass: new () => IView, args?: any, props: IViewProps = {}): IView {
            // 修正参数
            if (props.cancelAllowed === void 0) { props.cancelAllowed = true; }

            const trans: boolean = props.trans;
            const cancelAllowed: boolean = props.cancelAllowed;

            delete props.trans;
            delete props.cancelAllowed;

            // 创建视图
            const view: IView = this.createViewByClass(viewClass);

            // 补充属性
            props.args = args;
            props.keepNode = false;
            props.viewClass = viewClass;

            // 执行弹出逻辑
            new ViewFacade(view).popup(trans, props).cancelAllowed = cancelAllowed;

            return view;
        }

        /**
         * 关闭当前视图，并显示上一个视图
         */
        closeView(view: IView): void {
            new ViewFacade(view).close();
        }

        /**
         * 根据提示内容来搜索提示框视图对象
         */
        searchPopupViewByMessage(message: string): IView {
            for (let i: number = this.$infos.length - 1; i > -1; i--) {
                const info: IViewStackInfo = this.$infos[i];
                // 必须是通用提示框类型
                if (info.view instanceof UIManager.getInstance().baseViewClass) {

                }
            }
            return null;
        }

        /**
         * 判断当前视图是否允许取消
         */
        get isCurrentViewCancelAllowed(): boolean {
            const info: IViewStackInfo = this.getActiveViewInfo();
            if (info != null && info.cancelAllowed == true) {
                return true;
            }
            return false;
        }
    }
}