<template>
  <div id="sidebar" v-on:resize="render()">
    <h1>Aristid</h1>
    <br />
    <div id="input">
      <label>Angle:</label>
      <input v-model.number="angle" type="number">
      <br />
      
      <label>Iterations</label>
      <input v-model.number="iter" type="number">
      <br />
      
      <label>Start Rule</label>
      <input v-model="start">
      <br />
      
      <textarea v-model="rules"></textarea>
      <small>Frame took {{ frameTime }} ms to render</small>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce";

import {renderSystem, parseRules} from '../util';

export default {
    name: 'sidebar',
    data: () => ({
        angle: 90,
        start: 'F',
        iter: 5,
        rules: 'F -> F-F+F[X]+F-F\nX -> +X\n',
        frameStart: 0,
        frameEnd: 0
    }),
    watch: {
        angle() { this.render(); },
        iter()  { this.render(); },
        start() { this.render(); },
        rules() { this.render(); }
    },
    methods: {
        render: debounce(function(e) {
            var rules = parseRules(this.rules);

            this.frameStart = new Date();

            renderSystem({
                angle: this.angle,
                start: this.start,
                iter: this.iter,
                rules: rules
            });

            this.frameEnd = new Date();
        }, 150)
    },
    computed: {
        frameTime() {
            return this.frameEnd - this.frameStart;
        }
    },
    created: function() {
        window.addEventListener('resize', this.render);
        this.render();
    }
}
</script>

<style>
#sidebar {
    padding: 2em;
    position: absolute;
    width: 25%;
    color: #aaa;
    background-color: transparent;
}

input {
    min-width: 30%;
    max-width: 100%;
    float: left;
}

label {
    width: 40%;
    float: left;
}

textarea {
    height: 10em;
    width: 100%;
    background-color: transparent;
    color: #aaa;
    font-family: Monaco, Monospace;
    font-size: large;
}
</style>
