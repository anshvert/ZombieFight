<template>
  <BabylonV1/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BabylonV1 from "@/components/babylon.vue";

export default defineComponent({
  name: 'App',
  components: {
      BabylonV1
  }
});
</script>

<style>
* {
    padding:0;
    margin:0;
    background-color: black;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 6px;
}
</style>
