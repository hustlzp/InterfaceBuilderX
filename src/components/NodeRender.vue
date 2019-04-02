<template>
  <view-render :view="node.view">
    <node-render :node="subnode" :key="subnode.view.id" v-for="subnode in node.subnodes"></node-render>
  </view-render>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ViewRender from "./ViewRender.vue";
import { Node } from "@/cocoa";

@Component({
  components: {
    ViewRender
  }
})
export default class NodeRender extends Vue {
  @Prop() node!: Node;
}
</script>

<style scoped lang="scss">
</style>
