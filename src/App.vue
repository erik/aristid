<template>
  <div id="wrapper">
    <sidebar></sidebar>
    <canvas id="canvas" width="75%" resize></canvas>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
  
export default {
    name: 'app',
    data: () => ({}),
    components: { Sidebar }
}
</script>

<style>
html, body {
    margin: 0;
    overflow: hidden;
    height: 100%;
}

/* Scale canvas with resize attribute to full size */
canvas[resize] {
    max-width: 100%;
    height: 100%;
}

</style>
