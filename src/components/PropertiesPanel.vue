<template>
  <div class="properties-panel">
    <el-collapse v-model="activeNames">
      <!-- 基本 -->
      <el-collapse-item title="基本" name="basic">
        <el-form ref="form" label-width="110px" size="small">
          <el-form-item label="类">
            <span class="static-text-value class-name">{{form.className}}</span>
          </el-form-item>
          <el-form-item label="名称" for="name">
            <el-input v-model="form.name" @input="onNameInput" id="name"></el-input>
          </el-form-item>
          <el-form-item label v-if="view && !view.isComponentInstance">
            <!-- 函数组件 -->
            <el-checkbox
              v-model="form.isFunctionComponent"
              @input="onIsFunctionComponentInput"
              id="is-function-component"
            >{{view.isRoot ? "函数" : "函数组件"}}</el-checkbox>

            <!-- 类组件 -->
            <el-checkbox
              v-model="form.isClassComponent"
              @input="onIsClassComponentInput"
              id="is-class-component"
            >{{view.isRoot ? "类" : "类组件"}}</el-checkbox>
          </el-form-item>
          <el-form-item
            :label="view.isFunctionComponent ? '组件名' : '组件名'"
            for="component-name"
            v-if="view && view.isComponent"
          >
            <el-input
              :value="form.componentName|capitalize"
              @input="onComponentNameInput"
              id="component-name"
            ></el-input>
          </el-form-item>
          <el-form-item label v-if="view && !view.isRoot">
            <el-checkbox
              v-model="form.isClassProperty"
              @input="onIsClassPropertyInput"
              id="is-class-property"
            >类组件属性</el-checkbox>
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <!-- 属性 -->
      <el-collapse-item title="属性" name="attributes" v-if="view && !view.isComponentInstance">
        <el-form ref="form" label-width="110px" size="small">
          <property-form-item
            v-for="attribute in attributes"
            :key="view.id + '.' + attribute.key"
            :attribute="attribute"
            @update="didAttributeUpdate($event, attribute)"
          ></property-form-item>
        </el-form>
      </el-collapse-item>

      <!-- 约束 -->
      <el-collapse-item title="约束" name="constraints" v-if="view">
        <div class="constraints-wap" v-if="view && view.constraints.length > 0">
          <div class="constraint" v-for="constraint in view.constraints" :key="constraint.id">
            {{view.constraintCodesForDisplay(constraint)}}
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editConstraint(constraint)">编辑</el-dropdown-item>
                <el-dropdown-item @click.native="removeConstraint(constraint)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <div class="el-icon-warning constraint-warning" v-if="view && view.isLackOfConstraints"></div>

        <el-button
          type="primary"
          class="btn-add-constraint"
          v-if="view"
          size="small"
          plain
          @click="addConstraint"
        >添加</el-button>
      </el-collapse-item>
    </el-collapse>

    <add-constraint-dialog
      :visible.sync="addConstraintDialogVisible"
      @create="didCreateConstraint"
      @update="didUpdateConstraint"
      :constraint="constraintToUpdate"
      :view="view"
      :siblingViews="siblingViews"
    ></add-constraint-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { capitalize } from "@/utils";
import { UIViewAttribute, UIView, AutoLayoutConstraint } from "@/cocoa";
import PropertyFormItem from "@/components/PropertyFormItem.vue";
import AddConstraintDialog from "@/components/AddConstraintDialog.vue";

interface Form {
  name: string | null;
  className: string | null;
  componentName: string | null;
  isFunctionComponent: boolean;
  isClassComponent: boolean;
  isClassProperty: boolean;
}

@Component({
  components: {
    PropertyFormItem,
    AddConstraintDialog
  }
})
export default class PropertiesPanel extends Vue {
  @Prop(UIView) view!: UIView | null;
  @Prop(Array) siblingViews!: UIView[];

  activeNames: string[] = ["basic", "attributes", "constraints"];

  form: Form = {
    name: null,
    className: null,
    componentName: null,
    isFunctionComponent: false,
    isClassComponent: false,
    isClassProperty: false
  };

  created() {
    this.form.name = this.view ? this.view.name : null;
    this.form.className = this.view ? this.view.className : null;
    this.form.isFunctionComponent = this.view
      ? this.view.isFunctionComponent
      : false;
    this.form.isClassComponent = this.view ? this.view.isClassComponent : false;
    this.form.componentName = this.view ? this.view.componentName : null;
    this.form.isClassProperty = this.view ? this.view.isClassProperty : false;
  }

  addConstraintDialogVisible: boolean = false;
  constraintToUpdate: AutoLayoutConstraint | null = null;

  didCreateConstraint(constraint: AutoLayoutConstraint) {
    if (!this.view) {
      return;
    }

    this.view.addConstraint(constraint);
  }

  didUpdateConstraint(constraint: AutoLayoutConstraint) {
    if (!this.view) {
      return;
    }

    this.view.updateConstraint(constraint);
  }

  addConstraint() {
    this.constraintToUpdate = null;
    this.addConstraintDialogVisible = true;
  }

  editConstraint(constraint: AutoLayoutConstraint) {
    if (!this.view) {
      return;
    }

    this.constraintToUpdate = constraint;
    this.addConstraintDialogVisible = true;
  }

  async removeConstraint(constraint: AutoLayoutConstraint) {
    if (!this.view) {
      return;
    }

    try {
      await this.$confirm("", "确认删除？");
    } catch (err) {
      return;
    }

    this.view.removeConstraint(constraint);
  }

  didAttributeUpdate(val: any, attribute: UIViewAttribute) {
    this.$emit("update", { key: attribute.key, value: val });
  }

  @Watch("view")
  onViewChanged(val: UIView | null, oldVal: UIView | null) {
    this.form.name = val ? val.name : null;
    this.form.className = val ? val.className : null;
    this.form.isFunctionComponent = val ? val.isFunctionComponent : false;
    this.form.isClassComponent = val ? val.isClassComponent : false;
    this.form.componentName = val ? val.componentName : null;
    this.form.isClassProperty = val ? val.isClassProperty : false;
  }

  @Watch("view.name")
  onViewNameChanged(newName: string | null) {
    this.form.name = newName;
  }

  onNameInput(val: string) {
    this.$emit("update", { key: "name", value: val });
  }

  onIsFunctionComponentInput(val: boolean) {
    this.$emit("update", { key: "isFunctionComponent", value: val });

    // isFunctionComponent 与 isClassComponent 不能同时为 true
    if (val && this.form.isClassComponent) {
      this.form.isClassComponent = false;
      this.$emit("update", { key: "isClassComponent", value: false });
    }

    this.$emit("update", {
      key: "isComponent",
      value: this.form.isFunctionComponent || this.form.isClassComponent
    });

    if (this.view) {
      this.form.componentName = val ? capitalize(this.view.name) : null;
      this.$emit("update", {
        key: "componentName",
        value: this.form.componentName
      });
    }
  }

  onIsClassComponentInput(val: boolean) {
    this.$emit("update", { key: "isClassComponent", value: val });

    // isFunctionComponent 与 isClassComponent 不能同时为 true
    if (val && this.form.isFunctionComponent) {
      this.form.isFunctionComponent = false;
      this.$emit("update", { key: "isFunctionComponent", value: false });
    }

    this.$emit("update", {
      key: "isComponent",
      value: this.form.isFunctionComponent || this.form.isClassComponent
    });

    if (this.view) {
      this.form.componentName = val ? capitalize(this.view.name) : null;
      this.$emit("update", {
        key: "componentName",
        value: this.form.componentName
      });
    }
  }

  onIsClassPropertyInput(val: boolean) {
    this.$emit("update", {
      key: "isClassProperty",
      value: val
    });
  }

  onComponentNameInput(val: string) {
    this.form.componentName = capitalize(val);
    this.$emit("update", {
      key: "componentName",
      value: this.form.componentName
    });
  }

  get attributes(): UIViewAttribute[] {
    return this.view ? this.view.attributes : [];
  }
}
</script>

<style scoped lang="scss">
.properties-panel {
  //   padding: 10px 10px;
  //   border-top: none;
  overflow-y: auto;
  overflow-x: hidden;
}

.class-name {
  font-weight: bold;
}

#is-function-component {
  margin-right: 25px;
}

.el-collapse {
  border: none;
}

.el-collapse-item {
  padding: 0px 20px 0 20px;
  border-bottom: 1px solid #ebeef5;
}
</style>

<style lang="scss">
.properties-panel {
  .el-form-item__content {
    width: 200px;
  }

  .constraints-wap {
    margin-bottom: 15px;

    .constraint {
      font-size: 13px;
      margin-bottom: 10px;
      background-color: #f4f4f5;
      border: 1px solid #eeeeee;
      border-radius: 4px;
      padding: 10px 0px 10px 15px;
      font-family: "SFMono-Regular", "monospace";

      &:last-child {
        margin-bottom: 0;
      }

      .el-dropdown {
        cursor: pointer;
        float: right;
        display: block;

        .el-dropdown-link {
          padding: 10px 10px;
        }

        &:hover {
          i {
            color: #409eff;
          }
        }
      }
    }
  }

  .constraint-warning {
    color: #ffc501;
    font-size: 20px;
    margin-bottom: 15px;
  }

  .btn-add-constraint {
    display: block;
    margin-bottom: 15px;
  }
}
</style>
