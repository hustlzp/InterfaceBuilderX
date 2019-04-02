<template>
  <div class="uiview" :style="style">
    <!-- <div class="name">{{view.name}}</div> -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UIView as UIViewClass } from "@/cocoa";
import { Style } from "@/css";

@Component
export default class UIView extends Vue {
  @Prop(UIViewClass) view!: UIViewClass;

  get backgroundColor(): string | null {
    return this.view.backgroundColor ? this.view.backgroundColor.hex : null;
  }

  get style(): Style {
    let style: Style = new Style();

    style.backgroundColor = this.backgroundColor;

    return style;
  }
}
</script>

<style scoped lang="scss">
.uiview {
//   padding: 20px 5px;
  position: relative;

  .name {
    position: absolute;
    left: 5px;
    top: 2px;
    color: gray;
    font-size: 14px;
  }
}
</style>
