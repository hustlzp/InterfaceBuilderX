<template>
  <el-dialog
    title="Add Subview"
    :visible.sync="dialogVisible"
    @opened="initData"
    @closed="resetData"
    class="dialog"
  >
    <el-form :model="form" label-width="80px" label-position="left">
      <el-form-item label="类">
        <el-select v-model="form.viewClass" placeholder="请选择类" filterable>
          <el-option
            v-for="viewClass in viewClasses"
            :key="viewClass.name"
            :label="viewClass.name"
            :value="viewClass"
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
  viewClass: { new (): UIView };
  name: string | null;
}

@Component
export default class AddViewDialog extends Vue {
  @Prop(Boolean) visible!: boolean;

  dialogVisible = false;
  form: Form = {
    viewClass: UIView,
    name: null
  };
  viewClasses: { new (): UIView }[] = [
    UIView,
    UILabel,
    UIButton,
    UIImageView,
    UITableView,
    UITextField
  ];

  created() {
    this.dialogVisible = this.visible;
  }

  async onSubmit() {
    if (!this.form.viewClass) {
      this.$message.error("类不能为空");
      return;
    }

    if (!this.form.name) {
      this.$message.error("名称不能为空");
      return;
    }

    let view = new this.form.viewClass();
    view.name = this.form.name;

    this.$emit("create", view);
    this.dialogVisible = false;
  }

  initData() {
    (this.$refs.inputName as ElInput).focus();
  }

  resetData() {
    this.form.viewClass = UIView;
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
