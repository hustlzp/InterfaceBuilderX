<template>
  <div class="home">
    <div class="tree-panel" @contextmenu="showContextMenu">
      <el-tree
        class="view-tree"
        :data="views"
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
    <codes-panel :view="views.length > 0 ? views[0] : null"></codes-panel>

    <properties-panel :view="selectedView" @update="didUpdateProperty"></properties-panel>

    <add-view-dialog :visible.sync="addViewDialogVisible" @create="didCreateView"></add-view-dialog>
  </div>
</template>

<script lang="ts">
const { remote } = require("electron");
const { Menu, MenuItem } = remote;

import {
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
import { ElTree, TreeNode } from "element-ui/types/tree";

@Component({
  components: {
    PropertiesPanel,
    ViewsPanel,
    CodesPanel,
    AddViewDialog
  }
})
export default class Home extends Vue {
  selectedView: UIView | null = null;

  views: UIView[] = [
    new UIView([
      new UILabel(),
      new UIButton([new UIImageView(),]),
      
      new UITableView(),
      new UITextField()
    ])
  ];
  // views: UIView[] = [];

  defaultProps = {
    label: (data: UIView, node: any): string => {
      return data.name;
    },
    children: "subviews"
  };

  addViewDialogVisible: boolean = false;

  handleNodeClick(data: UIView, node: TreeNode<string, UIView>) {
    this.selectedView = data;
  }

  didUpdateProperty(object: { key: string; value: any }) {
    let { key, value } = object;

    if (this.selectedView) {
      this.selectedView[key] = value;
    }
  }

  didCreateView(view: UIView) {
    if (this.selectedView) {
      this.selectedView.subviews.push(view);
    } else if (this.views.length > 0) {
      this.views[0].subnodes.push(view);
    } else {
      this.views.push(view);
    }

    this.selectedView = view;
  }

  removeSelectedNode() {
    if (!this.selectedView) {
      return;
    }

    this.$confirm("确认删除？")
      .then(_ => {
        if (this.selectedView == this.views[0]) {
          this.views = [];
          this.selectedView = null;
          return;
        }

        (this.$refs.tree as ElTree).remove(this.selectedView);
      })
      .catch(_ => {});
  }

  showContextMenu(event: any, view: UIView) {
    const menu = new Menu();
    let that = this;

    if (view) {
      this.selectedView = view;
    }

    menu.append(
      new MenuItem({
        label: "Add Subview",
        click() {
          that.addViewDialogVisible = true;
        }
      })
    );

    if (view) {
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

  @Watch("selectedView")
  selectedNodeChanged() {
    this.setCurrentNode();
  }

  @Watch("addViewDialogVisible")
  addViewDialogVisibleChanged() {
    this.setCurrentNode();
  }

  setCurrentNode() {
    this.$nextTick(() => {
      if (!this.selectedView) {
        return;
      }

      (this.$refs.tree as ElTree).setCurrentKey(this.selectedView.id);
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
