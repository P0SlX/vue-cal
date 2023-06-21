<template lang="pug">
w-app(:class="{ ready }" v-scroll="onScroll")
  top-bar(:offset-top="offsetTop")
  router-view

  w-transition-twist
    w-button.go-top.ma2(
      v-show="!goTopHidden"
      icon="material-icons keyboard_arrow_up"
      fixed
      bottom
      right
      round
      xl
      v-scroll-to="'#top'")

</template>

<script>
// Including the top bar from the documentation view and passing the
// offsetTop var slows down too much the top bar animation on scroll.
import TopBar from '@/documentation/components/top-bar.vue'
import '@/scss/index.scss'

export default {
  name: 'app',
  components: { TopBar },
  data: () => ({
    ready: false,
    offsetTop: 0,
    goTopHidden: true
  }),
  created () {
    setTimeout(() => (this.ready = true), 500)
  },
  methods: {
    onScroll () {
      this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
      this.goTopHidden = this.offsetTop < 200 ||
                         ((document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight) <= 100)
    }
  },
  directives: {
    scroll: {
      mounted: (el, binding) => {
        const f = evt => {
          if (binding.value(evt, el)) window.removeEventListener('scroll', f)
        }
        window.addEventListener('scroll', f)
      }
    },
    scrollTo: {
      mounted: (el, binding) => {
        el.addEventListener('click', () => {
          const target = binding.value && document.querySelector(binding.value)
          target.scrollIntoView()
        })
      }
    }
  }
}
</script>
