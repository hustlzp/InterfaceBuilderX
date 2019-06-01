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
        @node-drop="didNodeDrop"
        default-expand-all
        :expand-on-click-node="false"
        :empty-text="null"
        @node-contextmenu="showContextMenu"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-show="!node.editing" class="node-label">{{ node.label }}</span>
          <input
            ref="inputName"
            class="input-name"
            :value="data.name"
            @input="node.data.name = $event.target.value"
            type="text"
            v-if="node.editing"
            autofocus
            @blur="$set(node, 'editing', false)"
          >
          <span class="warning el-icon-warning" v-if="data.isLackOfConstraints"></span>
          <span v-if="data.isComponent" class="component-flag">{{data.componentName}}</span>
          <span
            v-if="data.isComponentInstance"
            class="component-instance-flag"
          >{{data.component.componentName}}</span>
        </span>
      </el-tree>
    </div>

    <!-- <views-panel :node="node"></views-panel> -->
    <codes-panel :view="views.length > 0 ? views[0] : null"></codes-panel>

    <properties-panel
      :view="selectedView"
      :siblingViews="selectedViewSiblingViews"
      @update="didUpdateProperty"
    ></properties-panel>

    <add-view-dialog
      :visible.sync="addViewDialogVisible"
      :view="viewForUpdating"
      @create="didCreateView"
      @update="didUpdateView"
    ></add-view-dialog>

    <add-component-instance-dialog
      :visible.sync="addComponentInstanceDialogVisible"
      :components="components"
      @create="didCreateComponentInstance"
    ></add-component-instance-dialog>

    <add-constraint-dialog
      :visible.sync="addConstraintDialogVisible"
      @create="didCreateConstraint"
      :view="selectedView"
      :siblingViews="selectedViewSiblingViews"
    ></add-constraint-dialog>

    <!-- <update-view-class-dialog
      :visible.sync="updateViewClassDialogVisible"
      @update="didUpdateViewClass"
      :view="selectedView"
    ></update-view-class-dialog>-->
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
  UITextField,
  UIStackView,
  AutoLayoutConstraint
} from "@/cocoa";
import uuidv4 from "uuid/v4";
import { ElTree, TreeNode } from "element-ui/types/tree";
import { Component, Vue, Watch } from "vue-property-decorator";
import PropertiesPanel from "@/components/PropertiesPanel.vue";
import ViewsPanel from "@/components/ViewsPanel.vue";
import CodesPanel from "@/components/CodesPanel.vue";
import AddViewDialog from "@/components/AddViewDialog.vue";
import AddComponentInstanceDialog from "@/components/AddComponentInstanceDialog.vue";
import AddConstraintDialog from "@/components/AddConstraintDialog.vue";
import UpdateViewClassDialog from "@/components/UpdateViewClassDialog.vue";
import { ElInput } from "element-ui/types/input";

@Component({
  components: {
    PropertiesPanel,
    ViewsPanel,
    CodesPanel,
    AddViewDialog,
    AddComponentInstanceDialog,
    AddConstraintDialog,
    UpdateViewClassDialog
  }
})
export default class Home extends Vue {
  selectedView: UIView | null = null;
  viewForUpdating: UIView | null = null;

  // views: UIView[] = [
  //   new UIStackView([
  //     new UILabel(),
  //     new UIButton([new UIImageView()]),
  //     new UITableView(),
  //     new UITextField()
  //   ])
  // ];
  views: UIView[] = [];

  defaultProps = {
    label: (data: UIView, node: any): string => {
      return data.name;
    },
    children: "subviews"
  };

  addViewDialogVisible = false;
  addComponentInstanceDialogVisible = false;
  addConstraintDialogVisible = false;
  updateViewClassDialogVisible = false;

  handleNodeClick(data: UIView, node: TreeNode<string, UIView>) {
    if (data === this.selectedView) {
      setTimeout(() => {
        if (this.selectedView !== data) {
          return;
        }

        this.$set(node, "editing", true);
        this.$nextTick(() => {
          (this.$refs.inputName as ElInput).focus();
        });
      }, 500);
    }

    this.selectedView = data;
  }

  didNodeDrop(
    node: TreeNode<string, UIView>,
    relatedNode: TreeNode<string, UIView>,
    position: any,
    event: any
  ) {
    if (position == "inner") {
      node.data.superview = relatedNode.data;
    } else {
      node.data.superview = relatedNode.data.superview;
    }
  }

  didUpdateProperty(object: { key: string; value: any }) {
    let { key, value } = object;

    if (this.selectedView) {
      this.selectedView[key] = value;

      if (key == "isComponent" && !value) {
        // 取消组件
        this.selectedView.componentInstances.forEach(instance => {
          instance.isComponentInstance = false;
          instance.component = null;
        });
        this.selectedView.componentInstances = [];
      }
    }
  }

  didCreateView(view: UIView) {
    if (this.selectedView) {
      this.selectedView.addSubview(view);
    } else if (this.views.length > 0) {
      this.views[0].addSubview(view);
    } else {
      this.views.push(view);
    }

    // this.selectedView = view;
  }

  didCreateComponentInstance(view: UIView) {
    if (this.selectedView) {
      this.selectedView.addSubview(view);
    } else if (this.views.length > 0) {
      this.views[0].addSubview(view);
    } else {
      this.views.push(view);
    }
  }

  async removeSelectedNode() {
    if (!this.selectedView) {
      return;
    }

    try {
      await this.$confirm(
        "",
        `确认删除${this.selectedView.isComponent ? "组件" : " View"}？`
      );
    } catch (err) {
      return;
    }

    if (this.selectedView == this.views[0]) {
      this.views = [];
      this.selectedView = null;
      return;
    }

    // 取消组件
    if (this.selectedView.isComponent) {
      this.selectedView.componentInstances.forEach(instance => {
        instance.isComponentInstance = false;
        instance.component = null;
      });
      this.selectedView.componentInstances = [];
    }

    (this.$refs.tree as ElTree).remove(this.selectedView);
    this.selectedView = null;
  }

  didUpdateView(payload: {
    view: UIView;
    name: string;
    viewClass: { new (): UIView };
  }) {
    let { view, name, viewClass } = payload;

    if (!viewClass) {
      view["name"] = name;
      return;
    }

    let newView = new viewClass();

    // attributes
    Object.keys(view).forEach(key => {
      if (Object.keys(newView).includes(key) && key != "className") {
        newView[key] = view[key];
      }
    });
    console.log(name);

    // subviews
    if (view.superview) {
      view.superview.subviews = view.superview.subviews.map(subview =>
        subview === view ? newView : subview
      );
    } else {
      this.views = [newView];
    }

    // superview
    view.subviews.forEach(subview => {
      subview.superview = newView;
    });

    // component instances
    if (view.component) {
      view.component.componentInstances = view.component.componentInstances.map(
        instance => (instance == view ? newView : instance)
      );
    }

    // component
    view.componentInstances.forEach(instance => {
      instance.component = newView;
    });

    // constraints
    if (this.views[0]) {
      this.views[0].constraintIterator(constraint => {
        if (constraint.view === view) {
          constraint.view = newView;
        }
        if (constraint.toView === view) {
          constraint.toView = newView;
        }
      });
    }

    this.selectedView = newView;
  }

  // 更新 view 的类
  // didUpdateViewClass(view: UIView, viewClass: { new (): UIView }) {}

  didCreateConstraint(constraint: AutoLayoutConstraint) {
    if (!this.selectedView) {
      return;
    }

    this.selectedView.addConstraint(constraint);
  }

  // updateNodeName(event: any, node: TreeNode<string, UIView>) {
  //   node.data.name = event.target.value;
  // }

  showContextMenu(event: any, view: UIView) {
    const menu = new Menu();
    let that = this;

    if (view) {
      this.selectedView = view;
    }

    if (!this.selectedView || !this.selectedView.isComponentInstance) {
      menu.append(
        new MenuItem({
          label: "Add Subview",
          click() {
            that.viewForUpdating = null;
            that.addViewDialogVisible = true;
          }
        })
      );
    }

    if (this.views.length > 0) {
      menu.append(
        new MenuItem({
          label: "Add Constraint",
          click() {
            that.addConstraintDialogVisible = true;
          }
        })
      );
    }

    if (
      !this.selectedView ||
      (!this.selectedView.isComponentInstance && !this.selectedView.isComponent)
    ) {
      menu.append(
        new MenuItem({
          label: "Add Component Instance",
          click() {
            that.addComponentInstanceDialogVisible = true;
          }
        })
      );
    }

    if (view) {
      menu.append(
        new MenuItem({
          label: "Edit",
          click() {
            that.viewForUpdating = view;
            that.addViewDialogVisible = true;
            // that.updateViewClassDialogVisible = true;
          }
        })
      );
    }

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

  get selectedViewSiblingViews(): UIView[] {
    if (!this.selectedView) {
      return [];
    }

    let superview = this.selectedView.superview;

    if (!superview) {
      return [];
    }

    var siblingViews: UIView[] = [superview];

    superview.subviews.forEach(subview => {
      if (subview == this.selectedView) {
        return;
      }

      siblingViews.push(subview);
    });

    return siblingViews;
  }

  get components(): UIView[] {
    return this.views.length > 0
      ? this.views[0].allSubviews().filter(subview => subview.isComponent)
      : [];
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

.input-name {
  font-size: 16px;
  padding: 0 2px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  border: 1px solid #409eff;
  outline: none;
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

.custom-tree-node {
  display: flex;
  align-items: center;
}

.warning {
  display: inline-block;
  color: #ffc501;
  font-size: 14px;
  // background-color: #ffc501;
  // width: 6px;
  // height: 6px;
  // border-radius: 3px;
  margin-left: 6px;
}

.component-flag,
.component-instance-flag {
  font-size: 13px;
  background-color: #f4f4f5;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 0 5px;
  height: 18px;
  display: block;
  font-weight: bold;
  line-height: 18px;
  margin-left: 6px;
  font-family: "SFMono-Regular", "monospace";
}

.component-instance-flag {
  font-weight: normal;
}
</style>

<style lang="scss">
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  font-weight: bold !important;

  .node-label {
    color: #000000;
  }
}

.el-tree--highlight-current
  .el-tree-node.is-drop-inner
  > .el-tree-node__content {
  background-color: #4d91f8 !important;

  .node-label {
    color: #fff;
  }
}
</style>
