import { useDictStore } from '@/store/modules/dictStore';
import { computed, onMounted, ref } from 'vue';
import { getRoomList } from '@/api/room';
export default function useDict() {
    onMounted(() => {
        getRoomListData()
    })
    const dictStore = useDictStore();
    // 获取字典
    const getDict = (key) => {
        return dictStore.getDict(key);
    }

    const setDict = (key, value) => {
        dictStore.setDict(key, value);
    };
    const removeDict = (key) => {
        dictStore.removeDict(key);
    }

    const getDictValue = (key, value) => {
        // 参数有效性校验
        if (typeof key !== 'string' || !value) return undefined;

        // 安全获取字典数据 
        const dictList = dictStore.getDict(key);
        console.log(dictList);
        

        // 返回匹配项
        return dictList.find(item => item.itemValue === value)?.itemText ?? undefined;
    }

    const roomList = ref([]);
    const getRoomListData = async () => {
        const params = {
            pageNumber: 1,
            pageSize: 10,
            status: '0',
        }
        const res = await getRoomList(params)
        if (res.success) {
            console.log(res);

            roomList.value = res.result.records.map(item => {
                return {
                    itemText: item.roomId,
                    itemValue: item.id
                }
            })
        }
    };
    return {
        getDict,
        getDictValue,
        setDict,
        removeDict,
        roomList,
        getRoomListData
    };
}