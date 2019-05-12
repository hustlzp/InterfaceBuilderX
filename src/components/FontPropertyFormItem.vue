<template>
  <div class="wap">
    <el-input class="input-size" v-model.number="size"></el-input>
    <el-select class="select-weight" v-model="weight" placeholder="请选择">
      <el-option v-for="weight in weightOptions" :key="weight" :label="weight" :value="weight"></el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { UIFont, UIFontWeight } from "../cocoa";

@Component
export default class FontPropertyFormItem extends Vue {
  @Prop(UIFont) value!: UIFont | null;

  size: number = 17;
  weight: UIFontWeight = UIFontWeight.regular;

  created() {
    this.size = this.value ? this.value.size : 17;
    this.weight = this.value ? this.value.weight : UIFontWeight.regular;
  }

  @Watch("size")
  sizeChanged() {
    let newFont = new UIFont();
    newFont.weight = this.weight;
    newFont.size = this.size;

    this.$emit("input", newFont);
  }

  @Watch("weight")
  weightChanged() {
    let newFont = new UIFont();
    newFont.weight = this.weight;
    newFont.size = this.size;

    this.$emit("input", newFont);
  }

  //   @Watch("font")
  //   fontChange() {
  //     this.size = this.value ? this.value.size : 17;
  //     this.weight = this.value ? this.value.weight : UIFontWeight.regular;
  //   }

  get weightOptions(): UIFontWeight[] {
    return [
      UIFontWeight.ultraLight,
      UIFontWeight.light,
      UIFontWeight.regular,
      UIFontWeight.medium,
      UIFontWeight.semibold,
      UIFontWeight.bold,
      UIFontWeight.heavy,
      UIFontWeight.black
    ];
  }
}
</script>

<style scoped lang="scss">
.wap {
  display: flex;
  justify-content: space-between;
}

.input-size {
  flex-grow: 1;
  flex-shrink: 1;
  width: 100px;
  margin-right: 10px;
}

.select-weight {
  flex-grow: 1;
  flex-shrink: 1;
}
</style>
