<template>
  <div id="app">
    <home/>
    <!-- <router-view/> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Home from "@/views/Home.vue";

export default Vue.extend({
  components: {
    Home: Home
  }
});
</script>


<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-collapse-item__wrap {
  border-bottom: none !important;
}
.el-collapse-item__header {
  border-bottom: none !important;
}
.el-collapse-item__content {
  padding-bottom: 10px !important;
}
.el-input--small .el-input__inner {
  padding: 0 10px;
}
.el-form-item__content {
  // line-height: 1 !important;
}
.el-form-item.el-form-item--small .el-form-item__label {
  // font-size: 12px;
  // line-height: initial;
}
.el-form-item.el-form-item--small .static-text-value {
  // line-height: 32px;
}
</style>
