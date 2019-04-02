<template>
  <div class="uilabel" :style="style">
    <!-- <div class="name">{{view.name}}</div> -->
    {{label.text}}
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";
import UIView from "./UIView.vue";
import { UILabel as UILabelClass } from "@/cocoa";

@Component
export default class UILabel extends Mixins(UIView) {
  get label(): UILabelClass {
    return this.view as UILabelClass;
  }
}
</script>

<style scoped lang="scss">
.uilabel {
  // padding: 20px 5px;
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
