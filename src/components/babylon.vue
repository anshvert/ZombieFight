<template>
  <h3>Babylon Expert</h3>
  <canvas></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {BasicScene} from "@/babylon/basicScene";

export default defineComponent({
  name: 'BabylonV1',
    mounted() {
      const canvas:any = document.querySelector("canvas")
        new BasicScene(canvas)
    }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
    height: 80%;
    width: 80%;
}
</style>
