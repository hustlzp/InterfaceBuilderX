<template>
  <el-dialog
    :title="title"
    append-to-body
    :visible.sync="dialogVisible"
    @open="initData"
    @opened="opened"
    width="720px"
    @closed="resetData"
    class="dialog"
  >
    <el-form :model="form" label-width="95px" label-position="right">
      <el-form-item label="Attribute">
        <!-- 添加时支持多选 -->
        <el-select
          v-if="!constraint"
          ref="selectAttribute"
          class="select-attribute"
          v-model="form.attributes"
          placeholder="请选择"
          filterable
          multiple
        >
          <el-option
            v-for="attribute in attributes"
            :key="attribute"
            :label="attribute"
            :value="attribute"
          ></el-option>
        </el-select>

        <!-- 编辑时不支持多选 -->
        <el-select
          v-if="constraint"
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
      </el-form-item>
      <el-form-item label>
        <el-select
          v-model="form.toAttribute"
          class="select-to-attribute"
          placeholder="请选择"
          filterable
        >
          <el-option label :value="null"></el-option>
          <el-option
            v-for="attribute in attributes"
            :key="attribute"
            :label="attribute"
            :value="attribute"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Constant" v-if="!showEdgeInsetsControl">
        <el-input v-model.number="form.constant" placeholder></el-input>
      </el-form-item>
      <el-form-item label="Constant" v-if="showEdgeInsetsControl">
        <edge-insets-form-item v-model="form.edgeInsetsConstant"></edge-insets-form-item>
      </el-form-item>
      <el-form-item label="Multiplier">
        <el-input v-model.number="form.multiplier" type="number" placeholder></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="default" @click="onSubmitAndContinue">提交并继续</el-button>
        <!-- <el-button type="default" @click="dialogVisible = false">取消</el-button> -->
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
  AutoLayoutConstraint,
  UIEdgeInsets
} from "@/cocoa";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { ElInput } from "element-ui/types/input";
import { ElSelect } from "element-ui/types/select";
import { IRawParams } from "../utils";
import UIEdgeInsetsFormItem from "@/components/property/UIEdgeInsetsFormItem.vue";

interface Form extends IRawParams {
  attribute: AutoLayoutAttribute | null;
  attributes: AutoLayoutAttribute[];
  relation: AutoLayoutRelation;
  toView: UIView | null;
  toAttribute: AutoLayoutAttribute | null;
  multiplier: number | null;
  constant: number | null;
  edgeInsetsConstant: UIEdgeInsets | null;
}

@Component({
  components: {
    "edge-insets-form-item": UIEdgeInsetsFormItem
  }
})
export default class AddConstraintDialog extends Vue {
  @Prop(Boolean) visible!: boolean;
  @Prop(AutoLayoutConstraint) constraint!: AutoLayoutConstraint | null;
  @Prop(UIView) view!: UIView;
  @Prop(Array) siblingViews!: UIView[];

  dialogVisible = false;
  form: Form = {
    attribute: null,
    attributes: [],
    relation: AutoLayoutRelation.equal,
    toView: null,
    toAttribute: null,
    multiplier: null,
    constant: null,
    edgeInsetsConstant: null
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
    AutoLayoutAttribute.left,
    AutoLayoutAttribute.top,
    AutoLayoutAttribute.right,
    AutoLayoutAttribute.bottom,
    AutoLayoutAttribute.edges,
    AutoLayoutAttribute.center,
    AutoLayoutAttribute.centerX,
    AutoLayoutAttribute.centerY,
    AutoLayoutAttribute.width,
    AutoLayoutAttribute.height
  ];

  created() {
    this.dialogVisible = this.visible;
  }

  async onSubmit() {
    this.submit(true);
  }

  onSubmitAndContinue() {
    this.submit(false);
    this.resetData();
  }

  submit(hide: boolean) {
    if (this.constraint) {
      if (!this.form.attribute) {
        this.$message.error("Attribute 不能为空");
        return;
      }
    } else {
      if (this.form.attributes.length == 0) {
        this.$message.error("Attribute 不能为空");
        return;
      }
    }

    if (
      !this.form.toView &&
      !this.form.constant &&
      !this.form.edgeInsetsConstant
    ) {
      this.$message.error("To View 与 Constant 不能都为空");
      return;
    }

    if (this.constraint) {
      let constraint = new AutoLayoutConstraint(
        this.view,
        this.form.attribute!,
        this.form.relation,
        this.form.toView,
        this.form.toAttribute,
        this.form.multiplier,
        this.showEdgeInsetsControl
          ? this.form.edgeInsetsConstant
          : this.form.constant
      );
      constraint.id = this.constraint.id;
      this.$emit("update", constraint);
    } else {
      this.form.attributes.forEach(attribute => {
        let constraint = new AutoLayoutConstraint(
          this.view,
          attribute,
          this.form.relation,
          this.form.toView,
          this.form.toAttribute,
          this.form.multiplier,
          this.showEdgeInsetsControl
            ? this.form.edgeInsetsConstant
            : this.form.constant
        );

        this.$emit("create", constraint);
      });
    }

    if (hide) {
      this.dialogVisible = false;
    }
  }

  initData() {
    Object.keys(this.form).forEach(key => {
      if (this.constraint) {
        if (key == "constant") {
          if (!(this.constraint.constant instanceof UIEdgeInsets)) {
            this.form.constant = this.constraint.constant;
          } else {
            this.form.constant = null;
          }
        } else if (key == "edgeInsetsConstant") {
          if (this.constraint.constant instanceof UIEdgeInsets) {
            this.form.edgeInsetsConstant = this.constraint.constant;
          } else {
            this.form.edgeInsetsConstant = null;
          }
        } else {
          this.form[key] = this.constraint[key];
        }
      }
    });
  }

  opened() {
    // (this.$refs.selectAttribute as ElSelect).focus();
  }

  resetData() {
    this.form.attribute = null;
    this.form.attributes = [];
    this.form.relation = AutoLayoutRelation.equal;
    this.form.toView = null;
    this.form.toAttribute = null;
    this.form.multiplier = null;
    this.form.constant = null;
    this.form.edgeInsetsConstant = null;
  }

  get title(): string {
    var title = "";

    if (this.view) {
      title += `${this.view.name} `;
    }

    // title += this.constraint ? "Edit Constraint" : "Add Constraint";

    return title;
  }

  get showEdgeInsetsControl(): boolean {
    if (!this.constraint) {
      return (
        this.form.attributes.length == 1 &&
        this.form.attributes[0] == AutoLayoutAttribute.edges
      );
    } else {
      return this.form.attribute == AutoLayoutAttribute.edges;
    }
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
.el-input,
.ui-edge-insets-form-item {
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
