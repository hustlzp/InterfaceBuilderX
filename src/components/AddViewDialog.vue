<template>
  <el-dialog
    :title="view ? 'Edit View' : 'Add View'"
    :visible.sync="dialogVisible"
    @open="initData"
    @opened="opened"
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
        <el-input
          autofocus
          ref="inputName"
          @keyup.enter.native="onSubmit"
          v-model="form.name"
          placeholder="名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="default" v-if="!view" @click="onSubmitAndContinue">提交并继续</el-button>
        <el-button type="text" class="btn-cancel" @click="dialogVisible = false">取消</el-button>
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
  UITextField,
  UIStackView
} from "@/cocoa";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { ElInput } from "element-ui/types/input";
import { ViewClasses } from "@/cocoa";

interface Form {
  viewClass: { new (): UIView };
  name: string | null;
}

@Component
export default class AddViewDialog extends Vue {
  @Prop(Boolean) visible!: boolean;
  @Prop(UIView) view!: UIView | null;

  dialogVisible = false;
  form: Form = {
    viewClass: UIView,
    name: null
  };
  viewClasses = ViewClasses;

  created() {
    this.dialogVisible = this.visible;
  }

  async onSubmit() {
    this.submit();
    this.dialogVisible = false;
  }

  onSubmitAndContinue() {
    this.submit();
    this.form.name = null;
  }

  submit() {
    if (!this.form.viewClass) {
      this.$message.error("类不能为空");
      return;
    }

    if (!this.form.name) {
      this.$message.error("名称不能为空");
      return;
    }

    if (this.view) {
      let payload: any = {
        view: this.view,
        name: this.form.name
      };

      if (this.form.viewClass !== this.view.constructor) {
        this.$emit("updateClass");
        payload["viewClass"] = this.form.viewClass;
      }

      this.$emit("update", payload);
    } else {
      let view = new this.form.viewClass();
      view.name = this.form.name;

      this.$emit("create", view);
    }
  }

  initData() {
    if (this.view) {
      this.form.viewClass = this.view.constructor as { new (): UIView };
      this.form.name = this.view.name;
    }
  }

  opened() {
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
.btn-cancel {
  color: #909399;
  margin-left: 15px !important;

  &:hover {
    color: #409eff;
  }
}
</style>
