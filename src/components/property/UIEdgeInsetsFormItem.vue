<template>
  <div class="ui-edge-insets-form-item">
    <el-input class="input-top" placeholder="t" v-model.number="top"></el-input>
    <el-input class="input-left" placeholder="l" v-model.number="left"></el-input>
    <el-input class="input-bottom" placeholder="b" v-model.number="bottom"></el-input>
    <el-input class="input-right" placeholder="r" v-model.number="right"></el-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { UIViewAttribute, UIEdgeInsets, UIImageView } from "@/cocoa";

@Component({
  components: {}
})
export default class UIEdgeInsetsFormItem extends Vue {
  @Prop(UIEdgeInsets) value!: UIEdgeInsets | null;

  top: number | null = null;
  left: number | null = null;
  bottom: number | null = null;
  right: number | null = null;

  created() {
    this.top = this.value ? this.value.top : null;
    this.left = this.value ? this.value.left : null;
    this.bottom = this.value ? this.value.bottom : null;
    this.right = this.value ? this.value.right : null;
  }

  @Watch("top")
  topChanged() {
    this.dataChanged();
  }

  @Watch("left")
  leftChanged() {
    this.dataChanged();
  }

  @Watch("bottom")
  bottomChanged() {
    this.dataChanged();
  }

  @Watch("right")
  rightChanged() {
    this.dataChanged();
  }

  dataChanged() {
    if (
      (this.top as any) === "" ||
      this.top === null ||
      (this.left as any) === "" ||
      this.left === null ||
      (this.bottom as any) === "" ||
      this.bottom === null ||
      (this.right as any) === "" ||
      this.right === null
    ) {
      this.$emit("input", null);
      return;
    }

    this.$emit(
      "input",
      new UIEdgeInsets(this.top!, this.left!, this.bottom!, this.right!)
    );
  }
}
</script>

<style scoped lang="scss">
.ui-edge-insets-form-item {
  display: flex;
  justify-content: space-between;

  .el-input {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
