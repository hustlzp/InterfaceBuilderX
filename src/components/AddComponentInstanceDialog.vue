<template>
  <el-dialog
    title="Add Subview"
    :visible.sync="dialogVisible"
    @opened="initData"
    @closed="resetData"
    class="dialog"
  >
    <el-form :model="form" label-width="80px" label-position="left">
      <el-form-item label="组件">
        <el-select v-model="form.component" value-key="id" placeholder="请选择组件" filterable>
          <el-option
            v-for="component in components"
            :key="component.id"
            :label="component.componentName"
            :value="component"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input autofocus ref="inputName" v-model="form.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="default" @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import uuidv4 from "uuid/v4";
import {
  UIView,
  UILabel,
  UIButton,
  UIImageView,
  UITableView,
  UITextField
} from "@/cocoa";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { ElInput } from "element-ui/types/input";

interface Form {
  component: UIView | null;
  name: string | null;
}

@Component
export default class AddComponentInstanceDialog extends Vue {
  @Prop(Boolean) visible!: boolean;
  @Prop(Array) components!: UIView[];

  dialogVisible = false;
  form: Form = {
    component: null,
    name: null
  };

  created() {
    this.dialogVisible = this.visible;
  }

  async onSubmit() {
    if (!this.form.component) {
      this.$message.error("组件不能为空");
      return;
    }

    if (!this.form.name) {
      this.$message.error("名称不能为空");
      return;
    }

    let viewClass = this.form.component.constructor as {
      new (): UIView;
    };
    let view = new viewClass();
    view.name = this.form.name;
    view.component = this.form.component;
    view.isComponentInstance = true;
    this.form.component.componentInstances.push(view);

    this.$emit("create", view);
    this.dialogVisible = false;
  }

  initData() {
    (this.$refs.inputName as ElInput).focus();
  }

  resetData() {
    this.form.component = null;
    this.form.name = null;
  }

  @Watch("dialogVisible")
  dialogVisibleChanged() {
    this.$emit("update:visible", this.dialogVisible);
  }

  @Watch("visible")
  visibleChanged() {
    this.dialogVisible = this.visible;
  }
}
</script>

<style scoped lang="scss">
</style>
