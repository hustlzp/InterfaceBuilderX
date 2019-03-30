<template>
  <div class="home">
    <el-tree
      class="view-tree"
      :data="data"
      :props="defaultProps"
      @node-click="handleNodeClick"
      default-expand-all
      @node-contextmenu="showContextMenu"
    >
      <span class="custom-tree-node" slot-scope="{ node }">
        <span>{{ node.label }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script lang="ts">
const { remote } = require("electron");
const { Menu, MenuItem } = remote;
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default Vue.extend({
  data() {
    return {
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    handleNodeClick(data: any) {
      console.log(data);
    },

    showContextMenu(event: any, data: any, node: any) {
      const menu = new Menu();
      menu.append(
        new MenuItem({
          label: "MenuItem1",
          click() {
            console.log("item 1 clicked");
          }
        })
      );
      menu.append(new MenuItem({ type: "separator" }));
      menu.append(
        new MenuItem({ label: "MenuItem2", type: "checkbox", checked: true })
      );
      console.log(event);
      console.log(data);
      console.log(node);
      menu.popup({ window: remote.getCurrentWindow() });
    }
  }
});
</script>

<style lang="scss" scoped>
.el-tree {
  width: 300px;
}
</style>
