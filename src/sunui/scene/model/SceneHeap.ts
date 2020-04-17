
module sunui {
    /**
     * 场景历史栈
     */
    export namespace SceneHeap {
        /**
         * 历史场景信息列表
         */
        const $infos: ISceneHeapInfo[] = [];

        /**
         * 根据场景名字获取信息索引
         */
        function findLatestHeapIndexByName(name: number): number {
            for (let i: number = $infos.length - 1; i > -1; i--) {
                if ($infos[i].name === name) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * 添加历史
         * @data: 参数对象，场景历史会暂时地持有场景数据，直到场景从历史中被移除
         */
        export function addHistory(name: number, data: any): void {
            const info: ISceneHeapInfo = {
                name: name,
                data: data
            }
            $infos.push(info);
        }

        /**
         * 移除历史
         */
        export function removeHistory(name: number): boolean {
            const index: number = findLatestHeapIndexByName(name);
            if (index > -1) {
                $infos.splice(index, 1);
            }
            return index > -1;
        }

        /**
         * 是否存在指定历史
         */
        export function hasHistory(name: number): boolean {
            return findLatestHeapIndexByName(name) > -1;
        }

        /**
         * 返回上一个历史场景信息
         */
        export function getLastestSceneInfo(): ISceneHeapInfo {
            if ($infos.length > 0) {
                return $infos[$infos.length - 1];
            }
            return null;
        }

        /**
         * 根据名字返回历史场景信息
         */
        export function getLastestSceneInfoByName(name: number): ISceneHeapInfo {
            const index: number = findLatestHeapIndexByName(name);
            if (index > -1) {
                return $infos[index];
            }
            return null;
        }

        /**
         * 删除历史
         */
        export function deleteHistories(deleteCount: number): void {
            while ($infos.length > 1 && deleteCount > 0) {
                $infos.pop();
                deleteCount--;
            }
        }
    }
}