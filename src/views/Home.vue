<template>
  <div class="home">
    <el-tree
      class="view-tree"
      :data="[node]"
      node-key="id"
      draggable
      ref="tree"
      highlight-current
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

    <!-- <views-panel :node="node"></views-panel> -->
    <codes-panel :node="node"></codes-panel>

    <properties-panel :node="selectedNode" @update="didUpdateProperty"></properties-panel>
  </div>
</template>

<script lang="ts">
const { remote } = require("electron");
const { Menu, MenuItem } = remote;

import {
  Node,
  UILabel,
  UIView,
  UIButton,
  UIViewAttribute,
  UIImageView,
  UITableView,
  UITextField
} from "@/cocoa";
import uuidv4 from "uuid/v4";
import { Component, Vue, Watch } from "vue-property-decorator";
import PropertiesPanel from "@/components/PropertiesPanel.vue";
import ViewsPanel from "@/components/ViewsPanel.vue";
import CodesPanel from "@/components/CodesPanel.vue";

@Component({
  components: {
    PropertiesPanel,
    ViewsPanel,
    CodesPanel
  }
})
export default class Home extends Vue {
  selectedNode: Node | null = null;

  node: Node = {
    id: uuidv4(),
    view: new UIView(),
    subnodes: [
      {
        id: uuidv4(),
        view: new UILabel(),
        subnodes: []
      },
      {
        id: uuidv4(),
        view: new UIButton(),
        subnodes: []
      },
      {
        id: uuidv4(),
        view: new UIImageView(),
        subnodes: []
      },
      {
        id: uuidv4(),
        view: new UITableView(),
        subnodes: []
      },
      {
        id: uuidv4(),
        view: new UITextField(),
        subnodes: []
      }
    ]
  };

  defaultProps = {
    label: (data: Node, node: any): string => {
      return data.view.name;
    },
    children: "subnodes"
  };

  handleNodeClick(data: Node) {
    this.selectedNode = data;
    // 解决需要点击两次才能 highlight 的 BUG
    this.$nextTick(() => {
      (this.$refs.tree as any).setCurrentKey(data.id);
    });
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
  width: 260px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  border-right: 1px solid #dcdcdc;
  padding: 10px 0;
}

.views-panel {
  position: fixed;
  top: 0;
  right: 360px;
  bottom: 0;
  left: 260px;
}

.codes-panel {
  position: fixed;
  top: 0;
  right: 360px;
  bottom: 0;
  left: 260px;
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

<style>
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  font-weight: bold !important;
  color: #000000;
}

.el-tree--highlight-current
  .el-tree-node.is-drop-inner
  > .el-tree-node__content {
  background-color: #4d91f8 !important;
  color: #fff;
}
</style>
