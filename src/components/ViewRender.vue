<template>
  <component :is="component" :view="view" v-if="component">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Node, UIView } from "@/cocoa";

@Component
export default class ViewRender extends Vue {
  @Prop(UIView) view!: UIView;

  component: any = null;

  async mounted() {
    this.component = (await import(`./cocoa/${
      this.view.className
    }.vue`)).default;
  }
}
</script>

<style scoped lang="scss">
</style>
