<template>
  <el-form-item :label="attribute.label">
    <el-input v-if="isText" v-model="value"></el-input>
    <el-input v-if="isNumber" v-model.number="value"></el-input>
    <el-color-picker v-if="isColor" v-model="value"></el-color-picker>
  </el-form-item>
</template>

<script lang="ts">
import { UIView, UIViewAttribute, UIColor } from "@/cocoa";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class PropertyFormItem extends Vue {
  //   @Prop() view!: UIView;
  @Prop(Object) attribute!: UIViewAttribute;

  value: any = this.getFromAttribute();

  getFromAttribute(): any {
    if (this.isText) {
      return this.attribute.value;
    } else if (this.isNumber) {
      return this.attribute.value;
    } else if (this.isColor) {
      return (this.attribute.value as UIColor).hex;
    } else {
      return null;
    }
  }

  @Watch("value")
  onValueChanged(val: any, oldVal: any) {
    console.log(val);
    if (this.isText) {
      this.$emit("update", val);
    } else if (this.isNumber) {
      this.$emit("update", val);
    } else if (this.isColor) {
      this.$emit("update", UIColor.fromHex(val));
    } else {
      this.$emit("update", val);
    }
  }

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
}
</script>

<style scoped lang="scss">
.el-color-picker {
  display: block;
}
</style>
