<template>
  <div class="home">
    <el-tree
      class="view-tree"
      :data="nodes"
      :props="defaultProps"
      @node-click="handleNodeClick"
      default-expand-all
      :expand-on-click-node="false"
      @node-contextmenu="showContextMenu"
    >
      <span class="custom-tree-node" slot-scope="{ node }">
        <span>{{ node.label }}</span>
      </span>
    </el-tree>

    <properties-panel :node="selectedNode" @update="didUpdateProperty"></properties-panel>
  </div>
</template>

<script lang="ts">
const { remote } = require("electron");
const { Menu, MenuItem } = remote;
import { Node, UILabel, UIView, UIViewAttribute } from "@/cocoa";
import { Component, Vue } from "vue-property-decorator";
import PropertiesPanel from "@/components/PropertiesPanel.vue"; // @ is an alias to /src

@Component({
  components: {
    PropertiesPanel
  }
})
export default class Home extends Vue {
  selectedNode: Node | null = null;

  nodes?: Node[] = [
    {
      view: new UIView(),
      subviews: [
        {
          view: new UILabel(),
          subviews: [] as Node[]
        }
      ]
    }
  ] as Node[];

  defaultProps = {
    label: (data: Node, node: any): string => {
      return data.view.name;
    },
    children: "subviews"
  };

  handleNodeClick(data: Node) {
    this.selectedNode = data;
  }

  didUpdateProperty(object: { key: string; value: any }) {
    let { key, value } = object;

    if (this.selectedNode) {
      this.selectedNode.view[key] = value;
    }
  }

  showContextMenu(event: any, data: any, node: any) {
    const menu = new Menu();
    menu.append(
      new MenuItem({
        label: "Add Subview",
        click() {}
      })
    );
    menu.popup({ window: remote.getCurrentWindow() });
  }
}
</script>

<style lang="scss" scoped>
.view-tree {
  width: 300px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  border-right: 1px solid #dcdcdc;
  padding: 10px 0;
}

.properties-panel {
  width: 360px;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  border-left: 1px solid #dcdcdc;
}
</style>
