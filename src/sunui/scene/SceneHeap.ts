
module sunui {
    /**
     * 场景历史管理器
     */
    export class SceneHeap {
        /**
         * 场景历史栈
         */
        private static $infos: Array<ISceneHeapInfo> = [];

        static addHistory(name: number, args: any): void {
            const info: ISceneHeapInfo = {
                name: name,
                args: args
            }
            SceneHeap.$infos.push(info);
        }

        static removeHistory(name: number): boolean {
            const index: number = SceneHeap.findHeapIndexByName(name);
            if (index > -1) {
                SceneHeap.$infos.splice(index, 1);
            }
            return index > -1;
        }

        private static findHeapIndexByName(name: number): number {
            for (let i = SceneHeap.$infos.length - 1; i > -1; i--) {
                const info = SceneHeap.$infos[i];
                if (info.name === name) {
                    return i;
                }
            }
            return -1;
        }

        static hasHistory(name: number): boolean {
            return SceneHeap.findHeapIndexByName(name) > -1;
        }

        static pop(): ISceneHeapInfo {
            if (SceneHeap.$infos.length > 0) {
                return SceneHeap.$infos[SceneHeap.$infos.length - 1];
            }
            return null;
        }

        static popByName(name: number): ISceneHeapInfo {
            const index = SceneHeap.findHeapIndexByName(name);
            if (index > -1) {
                return SceneHeap.$infos[index];
            }
            return null;
        }
    }
}