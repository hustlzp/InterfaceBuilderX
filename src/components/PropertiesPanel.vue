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
            <el-input v-model="form.name" id="name"></el-input>
          </el-form-item>
          <el-form-item for="is-component">
            <el-checkbox v-model="form.isComponent" id="is-component">组件</el-checkbox>
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <!-- 属性 -->
      <el-collapse-item title="属性" name="attributes">
        <el-form ref="form" label-width="110px" size="small">
          <property-form-item
            v-for="attribute in attributes"
            :key="view.id + '.' + attribute.key"
            :attribute="attribute"
            @update="didAttributeUpdate($event, attribute)"
          ></property-form-item>
        </el-form>
      </el-collapse-item>

      <!-- Auto Layout -->
      <el-collapse-item title="布局" name="autolayout">
        <!-- <el-form ref="form" label-width="110px" size="small"> -->
        <!-- <property-form-item
            v-for="attribute in attributes"
            :key="view.id + '.' + attribute.key"
            :attribute="attribute"
            @update="didAttributeUpdate($event, attribute)"
        ></property-form-item>-->
        <div class="constraints-wap" v-if="view && view.constraints.length > 0">
          <div
            class="constraint"
            v-for="constraint in view.constraints"
            :key="constraint.id"
          >{{view.constraintCodesForDisplay(constraint)}}</div>
        </div>

        <el-button
          type="primary"
          class="btn-add-constraint"
          v-if="view"
          size="small"
          plain
          @click="addConstraint"
        >添加</el-button>
        <!-- </el-form> -->
      </el-collapse-item>
    </el-collapse>

    <add-constraint-dialog :visible.sync="addConstraintDialogVisible" @create="didCreateConstraint"></add-constraint-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { UIViewAttribute, UIView, AutoLayoutConstraint } from "@/cocoa";
import PropertyFormItem from "@/components/PropertyFormItem.vue";
import AddConstraintDialog from "@/components/AddConstraintDialog.vue";

@Component({
  components: {
    PropertyFormItem,
    AddConstraintDialog
  }
})
export default class PropertiesPanel extends Vue {
  @Prop(UIView) view!: UIView | null;

  activeNames: string[] = ["basic", "attributes", "autolayout"];

  form = {
    name: this.view ? this.view.name : null,
    className: this.view ? this.view.className : null,
    isComponent: this.view ? this.view.isComponent : false
  };

  addConstraintDialogVisible: boolean = false;

  didCreateConstraint(constraint: AutoLayoutConstraint) {
    if (!this.view) {
      return;
    }

    this.view.addConstraint(constraint);
  }

  didAttributeUpdate(val: any, attribute: UIViewAttribute) {
    this.$emit("update", { key: attribute.key, value: val });
  }

  @Watch("view")
  onViewChanged(val: UIView | null, oldVal: UIView | null) {
    this.form.name = val ? val.name : null;
    this.form.className = val ? val.className : null;
    this.form.isComponent = val ? val.isComponent : false;

    // let attributes = val ? val.attributes : [];
    // attributes.forEach(attribute => {
    //   let type = attribute.type;

    //   if (typeof type == "function") {
    //     console.log(type.name);
    //   } else {
    //     console.log(type);
    //   }
    // });
  }

  addConstraint() {
    this.addConstraintDialogVisible = true;
  }

  @Watch("form.name")
  onNameUpdate(val: string) {
    this.$emit("update", { key: "name", value: val });
  }

  @Watch("form.isComponent")
  onIsComponentUpdate(val: string) {
    this.$emit("update", { key: "isComponent", value: val });
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
    margin-bottom: 10px;

    .constraint {
      font-size: 15px;
      margin-bottom: 5px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .btn-add-constraint {
    display: block;
    margin-bottom: 15px;
  }
}
</style>
