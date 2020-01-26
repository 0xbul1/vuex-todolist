import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    listData: [], // 表格数据
    inputValue: 'aaa', //文本框内容
    nextId: 5,
  },
  mutations: {
    initListData(state, listData) {
      state.listData = listData;
    },
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
  },
  // action中数据请求拿到了，需要挂载到state处理，如果要操作数据action必须操作对应的mutation来处理数据

  actions: {
    getListData(context) {
      axios.get('/list.json').then(({ data }) => {
        context.commit('initListData', data);
      });
    },
  },
  modules: {},
});
