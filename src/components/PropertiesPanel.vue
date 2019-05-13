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
          <el-form-item for="is-component" v-if="view && !view.isComponentInstance">
            <el-checkbox v-model="form.isComponent" @input="onIsComponentInput" id="is-component">组件</el-checkbox>
          </el-form-item>
          <el-form-item
            label="组件名"
            for="component-name"
            v-if="view && view.isComponent && view.superview"
          >
            <el-input
              :value="form.componentName|capitalize"
              @input="onComponentNameInput"
              id="component-name"
            ></el-input>
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
      <el-collapse-item title="约束" name="constraints">
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
  isComponent: boolean;
  componentName: string | null;
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
    isComponent: false,
    componentName: null
  };

  created() {
    this.form.name = this.view ? this.view.name : null;
    this.form.className = this.view ? this.view.className : null;
    this.form.isComponent = this.view ? this.view.isComponent : false;
    this.form.componentName = this.view ? this.view.componentName : null;
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
    this.form.isComponent = val ? val.isComponent : false;
  }

  onNameInput(val: string) {
    this.$emit("update", { key: "name", value: val });
  }

  onIsComponentInput(val: string) {
    this.$emit("update", { key: "isComponent", value: val });

    if (this.view) {
      this.form.componentName = val ? capitalize(this.view.name) : null;
      this.$emit("update", {
        key: "componentName",
        value: this.form.componentName
      });
    }
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
}

.class-name {
  font-weight: bold;
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

  .btn-add-constraint {
    display: block;
    margin-bottom: 15px;
  }
}
</style>
