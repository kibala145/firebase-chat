<script type="text/jsx">
export default {
  name: 'BaseTransition',
  functional: true,
  props: {
    type: {
      type: String,
      default: 'fade'
    },
    mode: {
      type: String,
      default: 'out-in'
    },
    duration: {
      type: Number,
      default: 100
    },
    direction: {
      type: String,
      default: null
    }
  },
  render(h, {props, children}) {
    const transitionData = {
      props: {
        mode: props.mode,
        duration: props.duration
      }
    }

    let transitionName, transitionHandlers

    function setDuration(el) {
      el.style.transitionDuration = `${props.duration}ms`
    }

    function cleanUpDuration(el) {
      el.style.transitionDuration = ""
    }

    switch(props.type) {
      case 'fade':
        transitionName = props.direction ? `fade-${props.direction}` : 'fade'
        transitionHandlers = {
          beforeEnter: setDuration,
          afterEnter: cleanUpDuration,
          beforeLeave: setDuration,
          afterLeave: cleanUpDuration,
        }
        break
      case 'expand':
        transitionName = "expand"
        transitionHandlers = {
          beforeEnter: setDuration,
          afterEnter(el) {
            // eslint-disable-next-line no-param-reassign
            el.style.height = `auto`;
          },
          enter(el) {
            const { width } = getComputedStyle(el);
            /* eslint-disable no-param-reassign */
            el.style.width = width;
            el.style.position = `absolute`;
            el.style.visibility = `hidden`;
            el.style.height = `auto`;
            /* eslint-enable */
            const { height } = getComputedStyle(el);
            /* eslint-disable no-param-reassign */
            el.style.width = null;
            el.style.position = null;
            el.style.visibility = null;
            el.style.height = 0;
            /* eslint-enable */
            // Force repaint to make sure the
            // animation is triggered correctly.
            // eslint-disable-next-line no-unused-expressions
            getComputedStyle(el).height;
            requestAnimationFrame(() => {
              // eslint-disable-next-line no-param-reassign
              el.style.height = height;
            });
          },
          beforeLeave: setDuration,
          leave(el) {
            const { height } = getComputedStyle(el);
            // eslint-disable-next-line no-param-reassign
            el.style.height = height;
            // Force repaint to make sure the
            // animation is triggered correctly.
            // eslint-disable-next-line no-unused-expressions
            getComputedStyle(el).height;
            requestAnimationFrame(() => {
              // eslint-disable-next-line no-param-reassign
              el.style.height = 0;
            })
          },
          afterLeave: cleanUpDuration
        }
        break
    }

    transitionData.props.name = transitionName
    transitionData.on = transitionHandlers

    return (
      <transition {...transitionData}>
        {children}
      </transition>
    )
  }
}
</script>

<style style="scss">
  /* fade */
  .fade-y-enter-active, .fade-y-leave-active, .fade-x-enter-active, .fade-x-leave-active, .fade-enter-active, .fade-leave-active {
    transition-property: all;
    transition-timing-function: ease-in-out;
  }
  .fade-y-enter, .fade-y-leave-to, .fade-x-enter, .fade-x-leave-to, .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .fade-y-enter, .fade-y-leave-to {
    transform: translateY(-1.2rem);
  }
  .fade-x-enter, .fade-x-leave-to {
    transform: translateX(-1.2rem);
  }
  .fade-y-enter-to, .fade-y-leave, .fade-x-enter-to, .fade-x-leave, .fade-enter-to, .fade-leave {
    opacity: 1;
  }
  /* expand */
  .expand-enter-active,
  .expand-leave-active {
    transition-property: height;
    transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
    overflow: hidden;
  }
  .expand-enter,
  .expand-leave-to {
    height: 0;
  }
</style>

<style scoped>
/* * {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
} */
</style>