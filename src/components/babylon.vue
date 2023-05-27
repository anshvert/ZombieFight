<template>
  <canvas></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AnimEvents } from "@/babylon/AnimEvents";

export default defineComponent({
  name: 'BabylonV1',
    mounted() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    new AnimEvents(canvas)
    }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
main {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
canvas {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  box-shadow: 8px 8px 10px -6px #000000;
}
</style>