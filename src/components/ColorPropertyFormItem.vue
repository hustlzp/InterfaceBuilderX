<template>
  <div class="wap">
    <el-input class="input-color-hex" :maxlength="6" :minlength="6" v-model="colorHex"></el-input>
    <div class="color-preview" :style="colorPreviewStyle"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { UIColor } from "../cocoa";

@Component({
  components: {}
})
export default class ColorPropertyFormItem extends Vue {
  @Prop(UIColor) value!: UIColor | null;

  colorHex: string | null = null;

  created() {
    this.colorHex = this.value ? this.value.hex.replace("#", "") : null;
  }

  @Watch("colorHex")
  colorHexChanged() {
    this.$emit("input", this.color);
  }

  get color(): UIColor | null {
    let colorHex = (this.colorHex || "").trim().replace(" ", "");

    if (!colorHex || colorHex.length != 6) {
      return null;
    }

    return UIColor.fromHex("#" + colorHex);
  }

  get colorPreviewStyle(): Object {
    if (!this.color) {
      return {};
    }

    return {
      backgroundColor: this.color.hex
    };
  }
}
</script>

<style scoped lang="scss">
.wap {
  display: flex;
  justify-content: space-between;
}

.input-color-hex {
  margin-right: 10px;
  flex-shrink: 1;
}

.color-preview {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
  display: inline-block;
  border-radius: 4px;
}
</style>
