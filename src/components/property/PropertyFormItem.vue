<template>
  <el-form-item :label="attribute.label" :for="attribute.key">
    <el-input v-if="isText" v-model="value" :id="attribute.key"></el-input>
    <el-input v-if="isNumber" v-model.number="value" :id="attribute.key"></el-input>
    <color-property-form-item v-if="isColor" :attribute="attribute" v-model="value"></color-property-form-item>
    <font-property-form-item v-if="isFont" :attribute="attribute" v-model="value"></font-property-form-item>
    <image-property-form-item v-if="isImage" :attribute="attribute" v-model="value"></image-property-form-item>
    <edge-insets-form-item v-if="isEdgeInsets" :attribute="attribute" v-model="value"></edge-insets-form-item>
    <el-select v-model="value" placeholder="请选择" v-if="isEnum">
      <el-option
        v-for="enum_ in attribute.enums"
        :key="enum_.key"
        :label="enum_.key"
        :value="enum_.value"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script lang="ts">
import { UIView, UIViewAttribute, UIColor } from "@/cocoa";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import FontPropertyFormItem from "./FontPropertyFormItem.vue";
import ColorPropertyFormItem from "./ColorPropertyFormItem.vue";
import UIImagePropertyFormItem from "./UIImagePropertyFormItem.vue";
import UIEdgeInsetsFormItem from "./UIEdgeInsetsFormItem.vue";

@Component({
  components: {
    FontPropertyFormItem,
    ColorPropertyFormItem,
    "edge-insets-form-item": UIEdgeInsetsFormItem,
    "image-property-form-item": UIImagePropertyFormItem
  }
})
export default class PropertyFormItem extends Vue {
  @Prop(Object) attribute!: UIViewAttribute;

  value: any = null;

  created() {
    this.value = this.getFromAttribute();
    // console.log(this.attribute.type);
  }

  getFromAttribute(): any {
    // if (this.isText) {
    //   return this.attribute.value;
    // } else if (this.isNumber) {
    //   return this.attribute.value;
    // } else if (this.isColor) {
    //   return this.attribute.value;
    // } else if (this.isFont) {
    //   return this.attribute.value;
    // } else {
    return this.attribute.value;
    // }
  }

  @Watch("value")
  onValueChanged(val: any, oldVal: any) {
    // if (this.isText) {
    //   this.$emit("update", val);
    // } else if (this.isNumber) {
    //   this.$emit("update", val);
    // } else if (this.isColor) {
    //   this.$emit("update", val);
    // } else {
    this.$emit("update", val);
    // }
  }

  // @Watch("attribute")
  // onAttributeChanged(val: any, oldVal: any) {
  //   this.value = this.getFromAttribute();
  // }

  get isText(): boolean {
    return (
      typeof this.attribute.type == "function" &&
      this.attribute.type.name == "String"
    );
  }

  get isNumber(): boolean {
    return (
      typeof this.attribute.type == "function" &&
      this.attribute.type.name == "Number"
    );
  }

  get isColor(): boolean {
    return (
      typeof this.attribute.type == "function" &&
      this.attribute.type.name == "UIColor"
    );
  }

  get isFont(): boolean {
    return (
      typeof this.attribute.type == "function" &&
      this.attribute.type.name == "UIFont"
    );
  }

  get isImage(): boolean {
    return (
      typeof this.attribute.type == "function" &&
      this.attribute.type.name == "UIImage"
    );
  }

  get isEnum(): boolean {
    return (
      typeof this.attribute.type == "function" &&
      this.attribute.type.name == "Enum"
    );
  }

  get isEdgeInsets(): boolean {
    return (
      typeof this.attribute.type == "function" &&
      this.attribute.type.name == "UIEdgeInsets"
    );
  }
}
</script>

<style scoped lang="scss">
.el-color-picker {
  display: block;
}
</style>
