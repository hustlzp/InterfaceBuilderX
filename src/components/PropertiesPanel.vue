<template>
  <div class="properties-panel">
    <el-collapse v-model="activeNames">
      <!-- 基本 -->
      <el-collapse-item title="基本" name="basic">
        <el-form ref="form" label-width="110px" size="small">
          <el-form-item label="类">
            <span class="static-text-value class-name">{{form.className}}</span>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="组件化">
            <el-checkbox v-model="form.isComponent"></el-checkbox>
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
    </el-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { UIViewAttribute, UIView } from "@/cocoa";
import PropertyFormItem from "@/components/PropertyFormItem.vue";

@Component({
  components: {
    PropertyFormItem
  }
})
export default class PropertiesPanel extends Vue {
  @Prop(UIView) view?: UIView;

  activeNames: string[] = ["basic", "attributes"];

  form = {
    name: this.view ? this.view.name : null,
    className: this.view ? this.view.className : null,
    isComponent: this.view ? this.view.isComponent : false
  };

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
}
</style>
