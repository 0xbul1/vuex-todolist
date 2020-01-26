import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    listData: [], // 表格数据
    inputValue: 'aaa', //文本框内容
    nextId: 5, // 下次增加的id
    buttonGroupKey: 'all', // 已完成未完成按钮组的绑定字符串
  },
  mutations: {
    // 初始化数据
    initListData(state, listData) {
      state.listData = listData;
    },
    // 添加设置数据
    setInputValue(state, value) {
      state.inputValue = value;
    },
    // 添加一项item
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false,
      };
      state.listData.push(obj);
      state.nextId++;
      state.inputValue = '';
    },
    // 删除一项item
    removeItem(state, id) {
      // 找到索引
      const index = state.listData.findIndex(i => i.id === id);
      if (index !== -1) state.listData.splice(index, 1);
    },
    // 改变复选框的状态
    changeStatus(state, newStatus) {
      // 找到索引
      const index = state.listData.findIndex(i => i.id === newStatus.id);
      if (index !== -1) state.listData[index].done = newStatus.status;
    },
    // 清除已完成
    removeDone(state) {
      state.listData = state.listData.filter(i => i.done === false);
    },
    // 改变按钮组的状态，以后命名都带store吧
    storeChangeButtongroup(state, key) {
      state.buttonGroupKey = key;
    },
  },
  // action中数据请求拿到了，需要挂载到state处理，如果要操作数据action必须操作对应的mutation来处理数据

  actions: {
    getListData(context) {
      axios.get('/list.json').then(({ data }) => {
        context.commit('initListData', data);
      });
    },
  },
  getters: {
    undoneFinishLength(state) {
      return state.listData.filter(i => i.done === false).length;
    },
    requireListData(state) {
      if (state.buttonGroupKey === 'all') {
        return state.listData;
      }
      if (state.buttonGroupKey === 'undone') {
        return state.listData.filter(i => !i.done);
      }
      if (state.buttonGroupKey === 'done') {
        return state.listData.filter(i => i.done);
      }
      return state.listData;
    },
  },
  modules: {},
});
