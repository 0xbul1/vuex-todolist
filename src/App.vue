<!-- <template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style> -->

<template>
  <div id="app">
    <latern></latern>

    <a-input
      placeholder="请输入任务"
      class="my_ipt"
      :value="inputValue"
      @change="handleInputChange"
    />
    <a-button type="primary" @click="addItemToList">添加事项</a-button>

    <a-list bordered :dataSource="requireListData" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <!-- 这种写法可以但是没法传id -->
        <!-- <a-checkbox
          :checked="item.done"
          @change="callbackStatusChange(item.id)"
        > -->
        <a-checkbox
          :checked="item.done"
          @change="
            e => {
              callbackStatusChange(e, item.id);
            }
          "
        >
          {{ item.info }}</a-checkbox
        >
        <!-- 删除链接 -->
        <a slot="actions" @click="removeItemById(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{ undoneFinishLength }}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <a-button
            :type="buttonGroupKey === 'all' ? 'primary' : 'default'"
            @click="changeButtonGroup('all')"
            >全部</a-button
          >
          <a-button
            :type="buttonGroupKey === 'undone' ? 'primary' : 'default'"
            @click="changeButtonGroup('undone')"
            >未完成</a-button
          >
          <a-button
            :type="buttonGroupKey === 'done' ? 'primary' : 'default'"
            @click="changeButtonGroup('done')"
            >已完成</a-button
          >
        </a-button-group>
        <!-- 把已经完成的任务清空 -->
        <a @click="removeDoneClick">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
import Latern from './components/Latern.vue';
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'app',
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.$store.dispatch('getListData');
  },
  computed: {
    // 将vuex的数据通过计算属性绑定到input的value属性身上
    // listData改用getters实现
    // ...mapState(['listData', 'inputValue', 'buttonGroupKey']),
    ...mapState(['inputValue', 'buttonGroupKey']),
    ...mapGetters(['undoneFinishLength', 'requireListData']),
  },
  methods: {
    // 通过方法用input的值改变state的值
    handleInputChange(e) {
      this.$store.commit('setInputValue', e.target.value);
    },
    // 向列表添加新的一项
    addItemToList() {
      if (this.inputValue.trim().length <= 0)
        return this.$message.warning('您输入的内容不能为空！');
      this.$store.commit('addItem');
    },
    // 根据id删除某一项
    removeItemById(id) {
      this.$store.commit('removeItem', id);
    },
    // 复选框回调函数，因为要传两个参数
    callbackStatusChange(e, id) {
      const newStatus = {
        id: id,
        status: e.target.checked,
      };
      this.$store.commit('changeStatus', newStatus);
    },
    // 清空已完成
    removeDoneClick() {
      this.$store.commit('removeDone');
    },
    // 点击全部，已完成，未完成
    changeButtonGroup(key) {
      this.$store.commit('storeChangeButtongroup', key);
    },
  },
  components: {
    Latern,
  },
};
</script>

<style scoped>
#app {
  padding: 10px;
}

.my_ipt {
  width: 500px;
  margin-right: 10px;
}

.dt_list {
  width: 500px;
  margin-top: 10px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
