<template>
  <div class="home">
    <div class="tree-panel" @contextmenu="showContextMenu">
      <el-tree
        class="view-tree"
        :data="nodes"
        node-key="id"
        draggable
        ref="tree"
        highlight-current
        :props="defaultProps"
        @node-click="handleNodeClick"
        default-expand-all
        :expand-on-click-node="false"
        :empty-text="null"
        @node-contextmenu="showContextMenu"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </div>

    <!-- <views-panel :node="node"></views-panel> -->
    <codes-panel :node="nodes.length > 0 ? nodes[0] : null"></codes-panel>

    <properties-panel :node="selectedNode" @update="didUpdateProperty"></properties-panel>

    <add-view-dialog :visible.sync="addViewDialogVisible" @create="didCreateNode"></add-view-dialog>
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
import AddViewDialog from "@/components/AddViewDialog.vue";
import { ElTree } from "element-ui/types/tree";

@Component({
  components: {
    PropertiesPanel,
    ViewsPanel,
    CodesPanel,
    AddViewDialog
  }
})
export default class Home extends Vue {
  selectedNode: Node | null = null;

  // nodes: Node[] = [
  //   new Node(new UIView(), [
  //     new Node(new UILabel()),
  //     new Node(new UIButton()),
  //     new Node(new UIImageView()),
  //     new Node(new UITableView()),
  //     new Node(new UITextField())
  //   ])
  // ];
  nodes: Node[] = [];

  defaultProps = {
    label: (data: Node, node: any): string => {
      return data.view.name;
    },
    children: "subnodes"
  };

  addViewDialogVisible: boolean = false;

  handleNodeClick(data: Node) {
    this.selectedNode = data;
  }

  didUpdateProperty(object: { key: string; value: any }) {
    let { key, value } = object;

    if (this.selectedNode) {
      this.selectedNode.view[key] = value;
    }
  }

  didCreateNode(node: Node) {
    if (this.selectedNode) {
      this.selectedNode.subnodes.push(node);
    } else if (this.nodes.length > 0) {
      this.nodes[0].subnodes.push(node);
    } else {
      this.nodes.push(node);
    }

    this.selectedNode = node;
  }

  removeSelectedNode() {
    if (!this.selectedNode) {
      return;
    }

    this.$confirm("确认删除？")
      .then(_ => {
        if (this.selectedNode == this.nodes[0]) {
          this.nodes = [];
          this.selectedNode = null;
          return;
        }

        (this.$refs.tree as ElTree).remove(this.selectedNode);
      })
      .catch(_ => {});
  }

  showContextMenu(event: any, data: Node) {
    const menu = new Menu();
    let that = this;

    if (data) {
      this.selectedNode = data;
    }

    menu.append(
      new MenuItem({
        label: "Add Subview",
        click() {
          that.addViewDialogVisible = true;
        }
      })
    );

    if (data) {
      menu.append(
        new MenuItem({
          label: "Remove",
          click() {
            that.removeSelectedNode();
          }
        })
      );
    }

    menu.popup({ window: remote.getCurrentWindow() });
  }

  @Watch("selectedNode")
  selectedNodeChanged() {
    this.setCurrentNode();
  }

  @Watch("addViewDialogVisible")
  addViewDialogVisibleChanged() {
    this.setCurrentNode();
  }

  setCurrentNode() {
    this.$nextTick(() => {
      if (!this.selectedNode) {
        return;
      }

      (this.$refs.tree as ElTree).setCurrentKey(this.selectedNode.id);
    });
  }
}
</script>

<style lang="scss" scoped>
.tree-panel {
  width: 260px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  border-right: 1px solid #dcdcdc;

  .view-tree {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 10px 0;
  }
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
