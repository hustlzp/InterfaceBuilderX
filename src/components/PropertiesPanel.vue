<template>
  <div class="properties-panel">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本" name="basic">
        <el-form ref="form" label-width="50px" size="small">
          <el-form-item label="类">
            <el-input v-model="form.className"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="属性" name="attributes">
        <el-form ref="form" label-width="50px" size="small">
          <!-- <el-form-item label="类">
            <el-input v-model="form.className"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>-->
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Node } from "@/cocoa";

@Component
export default class PropertiesPanel extends Vue {
  @Prop(Node) node?: Node;

  activeNames: string[] = ["basic", "attributes"];

  form = {
    name: this.node ? this.node.view.name : null,
    className: this.node ? this.node.view.className : null
  };

  @Watch("node")
  onNodeChanged(val: Node | null, oldVal: Node | null) {
    this.form.name = val ? val.view.name : null;
    this.form.className = val ? val.view.className : null;
  }
}
</script>

<style scoped lang="scss">
.properties-panel {
  //   padding: 10px 10px;
  //   border-top: none;
}

.el-collapse {
  border: none;
}

.el-collapse-item {
  padding: 0px 20px 0 20px;
  border-bottom: 1px solid #ebeef5;
}
</style>
