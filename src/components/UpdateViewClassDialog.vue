<template>
  <el-dialog
    title="更新 View 类型"
    append-to-body
    :visible.sync="dialogVisible"
    @open="initData"
    @opened="opened"
    @closed="resetData"
    class="dialog"
  >
    <el-form :model="form" label-width="95px" label-position="right">
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="default" @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { ElSelect } from "element-ui/types/select";
import { UIView, ViewClasses } from "../cocoa";
import { IRawParams } from "../utils";

interface Form extends IRawParams {
  viewClass: { new (): UIView } | null;
}

@Component
export default class UpdateViewClassDialog extends Vue {
  @Prop(Boolean) visible!: boolean;
  @Prop(UIView) view!: UIView;

  viewClasses = ViewClasses;
  dialogVisible = false;
  form: Form = {
    viewClass: null
  };

  created() {
    this.dialogVisible = this.visible;
  }

  async onSubmit() {
    if (!this.form.viewClass) {
      this.$message.error("类不能为空");
      return;
    }

    if (this.form.viewClass === this.view.constructor) {
      this.dialogVisible = false;
      return;
    }

    this.$emit("update", this.view, this.form.viewClass);
    this.dialogVisible = false;
  }

  initData() {
    if (this.view) {
      this.form.viewClass = this.view.constructor as { new (): UIView };
    }
  }

  opened() {
    // (this.$refs.inputName as ElSelect).focus();
  }

  resetData() {
    Object.keys(this.form).forEach(key => {
      this.form[key] = null;
    });
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
