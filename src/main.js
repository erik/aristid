import Vue from 'vue';
import App from './App.vue';

import { initCanvas } from './util';

new Vue({
    el: '#app',
    render: h => h(App),
    mounted: () => initCanvas()
});
