<template>
  <h3>Babylon Expert</h3>
  <canvas></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {StandardMaterials} from "@/babylon/standardMaterials";

export default defineComponent({
  name: 'BabylonV1',
    mounted() {
      const canvas:any = document.querySelector("canvas")
        new StandardMaterials(canvas)
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
