<template>
  <div class="wap">
    <el-input
      class="input-image-name"
      :id="attribute.key"
      :maxlength="6"
      :minlength="6"
      v-model="name"
    ></el-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { UIViewAttribute, UIImage, UIImageView } from "@/cocoa";

@Component({
  components: {}
})
export default class UIImagePropertyFormItem extends Vue {
  @Prop(Object) attribute!: UIViewAttribute;
  @Prop(UIImage) value!: UIImage | null;

  name: string | null = null;

  created() {
    this.name = this.value ? this.value.name : null;
  }

  @Watch("name")
  nameChanged() {
    if (!this.name) {
      this.$emit("input", null);
      return;
    }

    this.$emit("input", new UIImage(this.name!));
  }
}
</script>

<style scoped lang="scss">
.wap {
  //   display: flex;
  //   justify-content: space-between;
}

.input-name {
  margin-right: 10px;
  //   flex-shrink: 1;
}
</style>
