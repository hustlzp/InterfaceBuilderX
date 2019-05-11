<template>
  <div class="codes-panel">
    <div class="codes-wap">
      <pre v-highlightjs="codes"><code class="swift"></code></pre>
    </div>
    <div class="bottom-bar">
      <div>
        <el-button type="primary" size="default" @click.native="copyCodes" plain>复制</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Node as NodeClass } from "@/cocoa";
import NodeRender from "@/components/NodeRender.vue";
import { codesForNode } from "@/cocoa";

// const { remote } =
const { clipboard } = require("electron");

@Component({
  components: {
    node: NodeRender
  }
})
export default class ViewsPanel extends Vue {
  @Prop() node!: NodeClass;

  codesForNode(): string {
    return codesForNode(this.node);
  }

  copyCodes() {
    clipboard.writeText(this.codes);
    this.$message("已复制");
  }

  get codes(): string {
    return codesForNode(this.node);
  }
}
</script>

<style scoped lang="scss">
.codes-panel {
  position: relative;
}

.codes-wap {
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 70px;

  pre {
    white-space: pre-wrap;
    padding: 30px 30px;
    margin: 0;
    line-height: 1.4;
  }

  code {
    font-family: "SFMono-Regular", "monospace";
    padding: 0;
  }
}

.bottom-bar {
  display: flex;
  align-items: center;
  border-top: 1px solid #dcdcdc;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 70px;
  padding-left: 30px;
  padding-right: 30px;
}
</style>
