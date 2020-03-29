<template>
  <div id="app" ref="appRef" class="app">
    <div uk-sticky="sel-target: uk-navbar-container; cls-active: uk-navbar-sticky">
      <nav class="uk-navbar-container" uk-navbar>
        <div class="uk-navbar-left">
          <ul class="uk-navbar-nav">
            <template v-if="user.loggedIn">
              <li :class="{'uk-active': $router.currentRoute.name === 'Home'}">
                <router-link to="/">Home</router-link>
              </li>
              <li>
                <a href="#" @click="signOut">Logout</a>
              </li>
            </template>
            <template v-else>
              <li :class="{'uk-active': $router.currentRoute.name === 'Login'}">
                <router-link to="/login">Login</router-link>
              </li>
              <li :class="{'uk-active': $router.currentRoute.name === 'Register'}">
                <router-link to="/register">Register</router-link>
              </li>
            </template>
          </ul>
        </div>
      </nav>
    </div>
    <notifications 
      group="messages-success" 
      position="top center" 
      classes="vue-notification success"
    />
    <notifications 
      group="messages-error" 
      position="top center" 
      classes="vue-notification error"
    />
    <notifications 
      group="messages-warning" 
      position="top center" 
      classes="vue-notification warning"
    />
    <base-transition>
      <router-view/>
    </base-transition>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import firebase from 'firebase'
import BaseTransition from './components/BaseTransition'

export default {
  name: 'App',
  components: {
    BaseTransition
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // @media screen and (min-width: 1024px) {
  //   padding: 0 0 0 30rem;
  // }
  // padding: 4rem 0 20vh 0;
  // padding: 4rem 0 0 0;
}

// .app {
//   height: 100vh;
//   overflow: hidden;
//   @media screen and (min-width: 1024px) {
//     height: auto;
//   }
// }

// .navigation {
//   display: flex;
//   position: fixed;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   top: 0;
//   left: 0;
//   right: 0;
//   height: 4rem;
//   background-color: white;
//   box-shadow: 0 .1rem 0 0 #d7d8db, 0 0 0 .1rem #e3e4e8;

//   @media screen and (min-width: 600px) {
    
//   }

//   @media screen and (min-width: 1024px) {
//     // position: fixed;
//     flex-direction: column;
//     align-items: flex-start;
//     justify-content: flex-start;
//     // top: 0;
//     // left: 0;
//     bottom: 0;
//     right: auto;
//     width: 30rem;
//     padding: 1rem 0;
//     height: auto;
//   }

//   a {
//     font-weight: bold;
//     color: #2c3e50;
//     text-decoration: none;
//     padding: .8rem 3rem;
//     width: 100%;
//     text-align: center;
//     @media screen and (min-width: 1024px) {
//       text-align: left;
//     }
//     &:hover {
//       background-color: #e2e2e2;
//     }
//     transition: all .6s cubic-bezier(0.165, 0.84, 0.44, 1);
//     &.router-link-exact-active {
//       color: #4eb5f1;
//     }
//   }
// }
</style>
