<template>
  <el-dialog
    title="Add Constraint"
    append-to-body
    :visible.sync="dialogVisible"
    @opened="initData"
    @closed="resetData"
    class="dialog"
  >
    <el-form :model="form" label-width="95px" label-position="right">
      <el-form-item label="Attribute">
        <el-select v-model="form.attribute" placeholder="请选择" filterable>
          <el-option
            v-for="attribute in attributes"
            :key="attribute"
            :label="attribute"
            :value="attribute"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Relation">
        <el-select v-model="form.relation" placeholder="请选择" filterable>
          <el-option
            v-for="relation in relations"
            :key="relation.value"
            :label="relation.key"
            :value="relation.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="To Attribute">
        <el-select v-model="form.toAttribute" placeholder="请选择" filterable>
          <el-option
            v-for="attribute in attributes"
            :key="attribute"
            :label="attribute"
            :value="attribute"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Constant">
        <el-input v-model="form.constant" placeholder></el-input>
      </el-form-item>
      <el-form-item label="Multiplier">
        <el-input v-model.number="form.multiplier" placeholder></el-input>
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
  UITextField,
  AutoLayoutAttribute,
  AutoLayoutRelation,
  AutoLayoutConstraint
} from "@/cocoa";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { ElInput } from "element-ui/types/input";

interface Form {
  attribute: AutoLayoutAttribute | null;
  relation: AutoLayoutRelation;
  toView: UIView | null;
  toAttribute: AutoLayoutAttribute | null;
  multiplier: number | null;
  constant: number | null;
}

@Component
export default class AddConstraintDialog extends Vue {
  @Prop(Boolean) visible!: boolean;
  @Prop(UIView) view!: UIView;

  dialogVisible = false;
  form: Form = {
    attribute: null,
    relation: AutoLayoutRelation.equal,
    toView: null,
    toAttribute: null,
    multiplier: null,
    constant: null
  };
  relations = [
    { key: "equal", value: AutoLayoutRelation.equal },
    { key: "lessThanOrEqual", value: AutoLayoutRelation.lessThanOrEqual },
    { key: "greaterThanOrEqual", value: AutoLayoutRelation.greaterThanOrEqual }
  ];
  attributes: AutoLayoutAttribute[] = [
    AutoLayoutAttribute.width,
    AutoLayoutAttribute.height,
    AutoLayoutAttribute.centerX,
    AutoLayoutAttribute.centerY,
    AutoLayoutAttribute.center,
    AutoLayoutAttribute.left,
    AutoLayoutAttribute.top,
    AutoLayoutAttribute.right,
    AutoLayoutAttribute.bottom,
    AutoLayoutAttribute.edges
  ];

  created() {
    this.dialogVisible = this.visible;
  }

  async onSubmit() {
    if (!this.form.attribute) {
      this.$message.error("attribute 不能为空");
      return;
    }

    let constraint = new AutoLayoutConstraint(
      this.view,
      this.form.attribute,
      this.form.relation,
      this.form.toView,
      this.form.toAttribute,
      this.form.multiplier,
      this.form.constant
    );

    this.$emit("create", constraint);
    this.dialogVisible = false;
  }

  initData() {
    // (this.$refs.inputName as ElInput).focus();
  }

  resetData() {
    this.form.attribute = null;
    this.form.relation = AutoLayoutRelation.equal;
    this.form.toView = null;
    this.form.toAttribute = null;
    this.form.multiplier = null;
    this.form.constant = null;
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
