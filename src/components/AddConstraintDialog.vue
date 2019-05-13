<template>
  <el-dialog
    :title="(constraint ? 'Edit' : 'Add') +  ' Constraint'"
    append-to-body
    :visible.sync="dialogVisible"
    @open="initData"
    @opened="opened"
    @closed="resetData"
    class="dialog"
  >
    <el-form :model="form" label-width="95px" label-position="right">
      <el-form-item label="View" v-if="view">
        <el-input :value="view.name" disabled class="input-view"></el-input>
        <el-select
          ref="selectAttribute"
          class="select-attribute"
          v-model="form.attribute"
          placeholder="请选择"
          filterable
        >
          <el-option
            v-for="attribute in attributes"
            :key="attribute"
            :label="attribute"
            :value="attribute"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Relation">
        <el-select v-model="form.relation" class="select-relation" placeholder="请选择" filterable>
          <el-option
            v-for="relation in relations"
            :key="relation.value"
            :label="relation.key"
            :value="relation.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="To View">
        <el-select
          value-key="id"
          class="select-to-view"
          v-model="form.toView"
          placeholder="请选择"
          filterable
        >
          <el-option
            v-for="siblingView in siblingViews"
            :key="siblingView.id"
            :label="siblingView.name"
            :value="siblingView"
          >
            <span style="float: left">{{ siblingView.name }}</span>
            <span
              style="float: right; color: #ccc; font-size: 14px"
              v-if="view && view.superview == siblingView"
            >superview</span>
          </el-option>
          <el-option v-if="view" label="self" :value="view"></el-option>
        </el-select>
        <el-select
          v-model="form.toAttribute"
          class="select-to-attribute"
          placeholder="请选择"
          filterable
        >
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
        <el-input v-model.number="form.multiplier" type="number" placeholder></el-input>
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
import { ElSelect } from "element-ui/types/select";
import { IRawParams } from "../utils";

interface Form extends IRawParams {
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
  @Prop(AutoLayoutConstraint) constraint!: AutoLayoutConstraint | null;
  @Prop(UIView) view!: UIView;
  @Prop(Array) siblingViews!: UIView[];

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
    { key: "equalTo", value: AutoLayoutRelation.equal },
    { key: "lessThanOrEqualTo", value: AutoLayoutRelation.lessThanOrEqual },
    {
      key: "greaterThanOrEqualTo",
      value: AutoLayoutRelation.greaterThanOrEqual
    }
  ];
  attributes: AutoLayoutAttribute[] = [
    AutoLayoutAttribute.edges,
    AutoLayoutAttribute.center,
    AutoLayoutAttribute.centerX,
    AutoLayoutAttribute.centerY,
    AutoLayoutAttribute.left,
    AutoLayoutAttribute.top,
    AutoLayoutAttribute.right,
    AutoLayoutAttribute.bottom,
    AutoLayoutAttribute.width,
    AutoLayoutAttribute.height
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

    if (this.constraint) {
      constraint.id = this.constraint.id;
      this.$emit("update", constraint);
    } else {
      this.$emit("create", constraint);
    }

    this.dialogVisible = false;
  }

  initData() {
    Object.keys(this.form).forEach(key => {
      if (this.constraint) {
        this.form[key] = this.constraint[key];
      }
    });
  }

  opened() {
    (this.$refs.selectAttribute as ElSelect).focus();
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
.el-input {
  width: 300px;
}

.input-view,
.select-to-view {
  width: 195px;
  margin-right: 12px;
}

.select-relation {
  width: 195px;
}

.select-attribute,
.select-to-attribute {
  width: 195px;
}
</style>
