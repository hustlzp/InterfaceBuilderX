<template>
  <div class="views-panel">
    <div class="inner-wap">
      <view-render :view="view"></view-render>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UIView } from "@/cocoa";
import ViewRender from "@/components/ViewRender.vue";

@Component({
  components: {
    viewRender: ViewRender
  }
})
export default class ViewsPanel extends Vue {
  @Prop() view!: UIView;
}
</script>

<style scoped lang="scss">
.views-panel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.inner-wap {
  width: 375px;
  height: 812px;
  overflow: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
</style>
