
module sunui {
    /**
     * 场景历史栈
     */
    export namespace SceneHeap {
        /**
         * 历史场景信息列表
         */
        const $infos: Array<ISceneHeapInfo> = [];

        /**
         * 根据场景名字获取信息索引
         */
        function findHeapIndexByName(name: number): number {
            for (let i: number = $infos.length - 1; i > -1; i--) {
                if ($infos[i].name === name) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * 添加历史
         * @args: 参数列表，允许为任意类型
         */
        export function addHistory(name: number, args: any): void {
            const info: ISceneHeapInfo = {
                name: name,
                args: args
            }
            $infos.push(info);
        }

        /**
         * 移除历史
         */
        export function removeHistory(name: number): boolean {
            const index: number = findHeapIndexByName(name);
            if (index > -1) {
                $infos.splice(index, 1);
            }
            return index > -1;
        }

        /**
         * 是否存在指定历史
         */
        export function hasHistory(name: number): boolean {
            return findHeapIndexByName(name) > -1;
        }

        /**
         * 返回上一个历史场景信息
         */
        export function pop(): ISceneHeapInfo {
            if ($infos.length > 0) {
                return $infos[$infos.length - 1];
            }
            return null;
        }

        /**
         * 根据名字返回历史场景信息
         */
        export function popByName(name: number): ISceneHeapInfo {
            const index: number = findHeapIndexByName(name);
            if (index > -1) {
                return $infos[index];
            }
            return null;
        }
    }
}