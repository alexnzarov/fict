import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vueHeadful from 'vue-headful';


Vue.component('vue-headful', vueHeadful);

Vue.config.productionTip = false;

Vue.directive('click-outside', {
    bind(el, binding) {
        el.addEventListener('click', e => e.stopPropagation());
        document.body.addEventListener('click', binding.value);
    },
    unbind(el, binding) {
        document.body.removeEventListener('click', binding.value);
    }
});


new Vue({
    router,

    render: h => h(App)
}).$mount('#app')
