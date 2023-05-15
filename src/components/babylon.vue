<template>
  <h3>Babylon Immortal</h3>
  <canvas></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {CustomModels} from "@/babylon/customModels";

export default defineComponent({
  name: 'BabylonV1',
    mounted() {
      const canvas:any = document.querySelector("canvas")
        new CustomModels(canvas)
    }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
    height: 90%;
    width: 90%;
}
</style>
