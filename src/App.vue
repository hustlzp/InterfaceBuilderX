<template>
  <div id="app">
    <router-view/>
  </div>
</template>

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
</style>
