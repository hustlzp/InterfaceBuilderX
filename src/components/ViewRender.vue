<template>
  <view-self-render :view="view">
    <view-render :view="subview" :key="subview.id" v-for="subview in view.subviews"></view-render>
  </view-self-render>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ViewSelfRender from "./ViewSelfRender.vue";
import { UIView } from "@/cocoa";

@Component({
  components: {
    ViewSelfRender
  }
})
export default class ViewRender extends Vue {
  @Prop() view!: UIView;
}
</script>

<style scoped lang="scss">
</style>
