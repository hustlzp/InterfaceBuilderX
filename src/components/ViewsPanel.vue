<template>
  <div class="views-panel">
    <div class="inner-wap">
      <node :node="node"></node>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Node as NodeClass } from "@/cocoa";
import NodeRender from "@/components/NodeRender.vue";

@Component({
  components: {
    node: NodeRender
  }
})
export default class ViewsPanel extends Vue {
  @Prop() node!: NodeClass;
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
