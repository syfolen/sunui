
module sunui {
    /**
     * 打开弹框命令
     */
    export class ShowPopupCommand extends AbstractPopupCommand {

        execute(view: Laya.Sprite, duration: number, props: IViewProps, option: PopupMethodEnum | ITween): void {
            // 若配置己存在，则说明节点己经被弹出了
            if (M.viewLayer.getInfoByView(view) !== null) {
                console.error(`${view}[${view.name}] is already popup.`);
                return;
            }
            // 默认背景不通透
            if (props.trans === void 0) { props.trans = false; }
            // 默认不保存节点
            if (props.keepNode === void 0) { props.keepNode = false; }

            // 参数列表
            const args: any = props.args;
            // 背景是否通透
            const trans: boolean = props.trans;
            // 显示层级
            const level: UILevel = props.level || view.zOrder || UILevel.POPUP;
            // 是否保留节点
            const keepNode: boolean = props.keepNode;

            delete props.args;
            delete props.trans;
            delete props.level;
            delete props.keepNode;

            // 避免props的默认属性不存在
            props = this.$makeProps(props);

            // 创建遮罩
            const mask: Laya.Image = M.viewLayer.createMask(view);
            mask.name = `Mask$${view.name}`;
            mask.alpha = trans === true ? 0 : mask.alpha;
            mask.zOrder = view.zOrder = level;

            // 生成弹框信息
            const info: IViewStackInfo = {
                view: view,
                mask: mask,
                closed: false,
                keepNode: keepNode,
                displayed: false,
                duration: duration,
                cancelAllowed: false
            };
            // 保存视图信息
            M.viewLayer.addToStack(info);

            // 显示视图
            M.viewLayer.addChild(mask);
            M.viewLayer.addChild(view);

            // 应用缓动数据
            this.$applyShowProps(view, props, duration);

            // 调用IPopupView的$onOpen接口
            M.viewLayer.onViewCreate(view, args);
            // 派发弹框创建完成事件
            if (args === void 0) {
                this.facade.sendNotification(NotifyKey.ON_POPUP_CREATED, view);
            }
            else if (args instanceof Array) {
                this.facade.sendNotification(NotifyKey.ON_POPUP_CREATED, [view].concat(args));
            }
            else {
                this.facade.sendNotification(NotifyKey.ON_POPUP_CREATED, [view, args]);
            }

            // 遮罩不通透逻辑处理
            Tween.get(mask, info.props.mod).from({ alpha: 0 }, 200);

            // 弹框弹出回调
            const handler: suncom.IHandler = suncom.Handler.create(this, this.$onPopupFinish, [view]);
            /**
             * TODO:
             * 由于duration的更改，故需要将Tween的回调改成由message调用
             */
            suncore.System.addTrigger(info.props.mod, duration, handler);
        }

        /**
         * 缓动结束
         */
        private $onPopupFinish(view: Laya.Sprite): void {
            const info: IViewStackInfo = M.viewLayer.getInfoByView(view);
            if (info !== null) {
                info.displayed = true;
                M.viewLayer.onViewOpen(view);
                this.facade.sendNotification(NotifyKey.ON_POPUP_OPENED, view);
            }
        }
    }
}