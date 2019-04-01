<template>
  <div class="properties-panel">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本" name="basic">
        <el-form ref="form" label-width="80px" size="small">
          <el-form-item label="类">
            <span class="static-text-value class-name">{{form.className}}</span>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="属性" name="attributes">
        <el-form ref="form" label-width="80px" size="small">
          <property-form-item
            v-for="attribute in attributes"
            :key="attribute.key"
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
import { Node, UIViewAttribute, UIView } from "@/cocoa";
import PropertyFormItem from "@/components/PropertyFormItem.vue";

@Component({
  components: {
    PropertyFormItem
  }
})
export default class PropertiesPanel extends Vue {
  @Prop(Node) node?: Node;

  activeNames: string[] = ["basic", "attributes"];

  form = {
    name: this.node ? this.node.view.name : null,
    className: this.node ? this.node.view.className : null
  };

  didAttributeUpdate(val: any, attribute: UIViewAttribute) {
    this.$emit("update", { attribute, value: val });
  }

  @Watch("node")
  onNodeChanged(val: Node | null, oldVal: Node | null) {
    this.form.name = val ? val.view.name : null;
    this.form.className = val ? val.view.className : null;

    let attributes = val ? val.view.attributes : [];
    attributes.forEach(attribute => {
      let type = attribute.type;

      if (typeof type == "function") {
        console.log(type.name);
      } else {
        console.log(type);
      }
    });
  }

  get attributes(): UIViewAttribute[] {
    return this.node ? this.node.view.attributes : [];
  }

  get view(): UIView | null {
    return this.node ? this.node.view : null;
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
