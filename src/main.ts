import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

const hljs = require('highlight.js/lib/highlight');
const swift = require('highlight.js/lib/languages/swift');
require('highlight.js/styles/xcode.css');
hljs.registerLanguage('swift', swift);

Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.directive('highlightjs', {
  bind: function (el, binding) {
    // on first bind, highlight all targets
    let targets = el.querySelectorAll('code')
    targets.forEach((target) => {
      // if a value is directly assigned to the directive, use this
      // instead of the element content.
      target.innerHTML = binding.value || null
      hljs.highlightBlock(target)
    })
  },
  componentUpdated: function (el, binding) {
    // after an update, re-fill the content and then highlight
    let targets = el.querySelectorAll('code')
    targets.forEach((target) => {
      target.innerHTML = binding.value || null
      hljs.highlightBlock(target)
    })
  }
})

new Vue({
  // router,
  store,
  render: h => h(App),
  // mounted() {
  //   // Prevent blank screen in Electron builds
  //   this.$router.push('/')
  // }
}).$mount('#app')
