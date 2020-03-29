<template>
  <div class="uk-container uk-container-large">
    <div ref="messagesRef" class="uk-overflow-auto uk-height-small uk-height-max uk-padding-small uk-padding-remove-left" uk-height-viewport="offset-top: true; offset-bottom: true; expand: true;">
      <button @click="!loadMoreDisabled ? loadMore() : null"  class="uk-button uk-button-default uk-width-1-1 uk-width-1-4@s" :disabled="loadMoreDisabled">Load more</button>
      <!-- <a 
        class="button"
        :disabled="loadMoreDisabled"
        @click="!loadMoreDisabled ? loadMore() : null"  
      >Load more</a> -->
      <div
        v-for="message in messagesArray" 
        :key="message.id"
        class="message"
        :class="{'message--editing': editMessage === message, 'message--yours': message.user_id === user.data.uid}"
      >
        <div class="uk-padding uk-padding-remove-left uk-padding-remove-vertical message__username">{{message.user_id === user.data.uid ? 'You' : message.user_nickname}}:</div>
        <template v-if="editMessage !== message">
          <span class="message__text">{{message.text}}</span>
        </template>
        <template v-else>
          <textarea 
            v-focus
            class="message__textarea"
            rows="1"
            v-model.trim="editMessageText"
            @keydown.enter.prevent="updateMessage(message)"
            @keydown.esc.prevent="cancelEdit"
          />
        </template>
        <ul v-if="message.user_id === user.data.uid" class="uk-iconnav message__actions">
          <template v-if="editMessage !== message">
            <a href="#" uk-icon="icon: pencil" @click="edit(message)"></a>
            <a href="#" uk-icon="icon: trash" @click="removeMessage(message)"></a>
          </template>
          <template v-else>
            <a href="#" uk-icon="icon: close" @click="cancelEdit"></a>
            <a href="#" uk-icon="icon: check" @click="updateMessage(message)"></a>
          </template>
        </ul>
      </div>
    </div>
    <form class="uk-grid-small uk-child-width-1-1@s uk-padding-small uk-padding-remove-horizontal" uk-grid @submit.prevent="addMessage">

      <div class="uk-inline">
        <input
          required
          type="text"
          class="uk-input"
          v-model.trim="text"
          placeholder="Enter message"
        >
      </div>
    </form>
    <!-- <div class="message-form-container">
      <form class="message-form" @submit="addMessage">
        <textarea id="messageInput" placeholder="message to people" v-model.trim="text" @keydown.enter.prevent="addMessage"/>
      </form>
    </div> -->
  </div>
</template>

<script>
/* eslint-disable */
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import {firebaseApp} from './../firebaseConfig'
import {mapGetters} from 'vuex'

const messagesRef = firebaseApp.database().ref('messages')

export default {
  name: 'Home',
  data() {
    return {
      messages: {},
      nickname: 'Anonymous',
      text: '',
      editMessage: null,
      editMessageText: null,
      showNew: true,
      isMobile: false,
      paginationSize: 3,
      curSize: 3,
      minSize: 3,
      loadMoreDisabled: false
    }
  },
  computed: {
    ...mapGetters(['user']),
    messagesArray() {
      return Object.keys(this.messages).map(key => ({...this.messages[key], id: key}))
    },
    scrollToBottom() {
      return this.isMobile || this.showNew
    }
  },
  methods: {
    login(){
      let vm = this
      let countryCode = '+' //india
      let email = countryCode + this.phone + '@domainName.com'
      let password = this.password
      //
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        //route to home on success !
        vm.$router.push({path:'/home'})
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        let errMsg = error.message.toLowerCase()
        while(errMsg.indexOf('email') != -1){
          errMsg = errMsg.replace("email address", "phone number");
        }
        //
        alert('Error: ' + errMsg)
      });
    },
    addMessage() {
      if(this.text) {
        debugger
        messagesRef.push({
          user_id: this.user.data.uid,
          user_nickname: this.user.data.displayName,
          text: this.text
        }).then(data => {
          debugger
          data
        }).catch(e => {
          debugger
          e
        })
        this.text = ''
      }
    },
    removeMessage(message) {
      messagesRef.child(message.id).remove().then(data => {
        debugger
        data
      }).catch(err => {
        debugger
        err
      })
    },
    updateMessage(message) {
      messagesRef.child(message.id).update({text: this.editMessageText})
      this.editMessage = null
      this.editMessageText = null
    },
    edit(message) {
      this.editMessage = message
      this.editMessageText = message.text
    },
    cancelEdit() {
      this.editMessage = null
      this.editMessageText = null
    },
    scrollBottom() {
      debugger
      this.$refs.messagesRef.scrollTop = this.$refs.messagesRef.scrollHeight - this.$refs.messagesRef.clientHeight
      // this.$refs.homeRef.scrollTop = this.$refs.homeRef.scrollHeight - this.$refs.homeRef.clientHeight
    },
    showNewHandler() {
      if(this.$refs.messagesRef.scrollTop !== this.$refs.messagesRef.scrollHeight - this.$refs.messagesRef.clientHeight && this.showNew) this.showNew = false
      else if(this.$refs.messagesRef.scrollTop === this.$refs.messagesRef.scrollHeight - this.$refs.messagesRef.clientHeight && !this.showNew) this.showNew = true
    },
    requestLastNItems(n) {
      const self = this
      
      return messagesRef.limitToLast(n).once('value')
    },

    async loadMore() {
      const self = this
      const snapshot = await this.requestLastNItems(this.messagesArray.length + this.paginationSize)
      const messages = snapshot.val()

      if(Object.keys(messages).length === self.messagesArray.length) self.loadMoreDisabled = true

      self.messages = messages || {}
    }
  },
  // watch: {
  //   messagesArray() {
  //     this.showNewHandler()

  //     if(this.scrollToBottom) {
  //       this.$nextTick(() => this.scrollBottom())
  //     }
  //   }
  // },
  created() {
    if (/Mobi|Android/i.test(navigator.userAgent)) this.isMobile = true

    const self = this

    const nickname = localStorage.getItem('nickname')

    if(nickname) {
      this.nickname = nickname
    } else {
      const nicknameInput = prompt('Enter nickname', 'Anonymous') || 'Anonymous'
      this.nickname = nicknameInput
      localStorage.setItem('nickname', this.nickname)
    }

    const test = messagesRef.limitToLast(this.paginationSize).once('value', snapshot => {
      const messages = snapshot.val()

      this.messages = messages || {}

      self.$nextTick(() => self.scrollBottom())
      messagesRef.limitToLast(1).on('child_added', snapshot => {
        debugger
        const newKey = snapshot.key,
              newMessage = snapshot.val()

        if(self.messages[newKey]) return

        this.$set(this.messages, newKey, newMessage)
        if(newMessage.user_id !== self.user.data.uid)
          self.$notify({
            group: 'messages-success',
            title: 'Message',
            text: `User ${newMessage.user_nickname} added new message`
          })

        if(self.scrollToBottom) {
          self.$nextTick(() => self.scrollBottom())
        }
      })
      messagesRef.on('child_removed', snapshot => {
        debugger
        const removedKey = snapshot.key,
              removedMessage = snapshot.val()
        
        self.$delete(self.messages, removedKey)

        // if(self.messagesArray.length < self.minSize) self.requestLastNItems(self.minSize)

        if(removedMessage.user_id !== self.user.data.uid)
          return self.$notify({
            group: 'messages-error',
            title: 'Message',
            text: `User ${removedMessage.user_nickname} removed message`
          })
      })

      messagesRef.on('child_changed', snapshot => {
        debugger
        const changedKey = snapshot.key,
              changedMessage = snapshot.val()

        self.messages[changedKey] = changedMessage

        if(changedMessage.user_id !== self.user.data.uid)
          return self.$notify({
            group: 'messages-warning',
            title: 'Message',
            text: `User ${changedMessage.user_nickname} edited message`
          })
      })
    })
  },
  // mounted() {
  //   const self = this

  //   if(!self.isMobile)
  //     self.$refs.messagesRef.addEventListener('scroll', this.showNewHandler)
  // }
}
</script>

<style lang="scss">
  $scrollbar-width: .3rem;
  :root {
    @media screen and (min-width: 600px) {
      // font-size: 62.5%;
    }
    body {
      margin: 0;
      // Body font size 16px
      // font-size: 1.6rem;
    }
    * {
      box-sizing: border-box;
    }
  }
  ::-webkit-scrollbar {
    width: $scrollbar-width;
    //display: none;
    //visibility: hidden;
  }

  ::-webkit-scrollbar-track {
    background: #F2F2F2;
    border-radius: .3rem;
  }

  ::-webkit-scrollbar-thumb {
    background: #BDBDBD;
    border-radius: .3rem;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #828282;
  }

  .message {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: .8rem 1.6rem;
    margin: .8rem 0;
    border: .1rem solid rgb(97, 97, 97);
    border-radius: .8rem;
    &__username, &__actions {
      flex-shrink: 0;
    }
    &__text {
      word-break: break-all;
      text-align: left;
      flex-grow: 1;
    }
    &__textarea {
      flex-grow: 1;
      font-size: 1rem;
      font-family: Avenir, Helvetica, Arial, sans-serif;
      padding: 0;
      outline: none;
      border: none;
      resize: none;
    }
    &--yours {
      border-style: dashed;
    }
  }

  // .messages-container {
  //   display: block;
  //   // flex-direction: column;
  //   // justify-content: flex-start;
  //   // align-items: stretch;
  //   height: 100%;
  //   // max-height: 100vh;
  //   overflow: auto;
  //   @media screen and (min-width: 1024px) {
  //     height: 80vh;
  //     &:hover {
  //       // overflow-y: scroll;
  //       border-right: none;
  //     }
  //     padding: .8rem 0;
  //   }
  //   // padding-top: .8rem;
  //   // padding-right: $scrollbar-width;
  //   padding: .8rem $scrollbar-width calc(0vh + .8rem) 0;
  //   // border-right: $scrollbar-width solid transparent;
  //   overflow-y: auto;
  //   // margin: 8rem;
  // }
  // .home {
  //   height: 100%;
  //   overflow: hidden;
  //   // padding: .8rem 0 calc(0vh + .8rem) 0;
  // }
  // .message {
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: flex-start;
  //   align-items: stretch;
  //   padding: .8rem;
  //   margin: .8rem;
  //   border: .1rem #E0E0E0 dashed;
  //   &--editing {
  //     border-width: .2rem;
  //     border-color: #BDBDBD;
  //     .message-header .message-buttons {
  //       opacity: 1;
  //     }
  //   }
  //   &--yours {
  //     .message-header {
  //       flex-direction: row-reverse;
  //       justify-content: flex-start;
  //     }
  //     .message-text {
  //       text-align: right;
  //     }
  //     .message-textarea {
  //       text-align: right;
  //     }
  //   }
  // }
  // .message-header {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   @media screen and (min-width: 600px) {
  //     &:hover {
  //       .message-buttons {
  //         opacity: 1;
  //       }
  //     } 
  //     .message-buttons {
  //       opacity: 0;
  //       transition: opacity .3s cubic-bezier(0.075, 0.82, 0.165, 1);
  //     }  
  //   }
  // }
  // .message-nickname {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   color: #616161;
  //   font-weight: 600;
  // }
  // .message-text {
  //   // display: flex;
  //   // justify-content: flex-start;
  //   // align-items: flex-start;
  //   text-align: left;
  //   white-space: pre-wrap;
  //   word-wrap: break-word;
  // }
  // a.button {
  //   display:inline-block;
  //   padding:0.3em 1.2em;
  //   margin:0 0.3em 0;
  //   border-radius:2em;
  //   box-sizing: border-box;
  //   text-decoration:none;
  //   font-family:'Roboto',sans-serif;
  //   font-weight:300;
  //   color:#FFFFFF;
  //   background-color:#4eb5f1;
  //   text-align:center;
  //   transition: all 0.2s;
  //   cursor: pointer;
  //   &:hover:not([disabled]) {
  //     background-color:#4095c6;
  //   }
  //   &[disabled] {
  //     cursor: not-allowed;
  //     background-color: #828282;
  //     color: #F2F2F2;
  //   }
  // }
  // @media screen and (max-width:30em) {
  //   a.button {
  //     display:block;
  //     margin:0.2em auto;
  //   }
  // }
  // .message-form-container {
  //   display: flex;
  //   justify-content: center;
  //   align-items: stretch;
  //   height: 20vh;
  //   overflow: hidden;
  //   position: fixed;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  //   background-color: white;
  //   @media screen and (min-width: 1024px) {
  //     position: relative;
  //     background-color: transparent;
  //   }
  //   // margin: 16rem;
  // }
  // .message-form {
  //   flex-grow: 1;
  //   display: flex;
  //   flex-direction: row;
  //   justify-content: center;
  //   align-items: center;
  //   padding: 0;
  //   @media screen and (min-width: 1024px) {
  //     padding: 0 .8rem 2rem .8rem;
  //   }
  //   textarea {
  //     width: 100%;
  //     height: 100%;
  //     padding: .8rem;
  //     resize: none;
  //     border-radius: .2rem;
  //     font-size: 1.6rem;
  //   }
  //   // min-width: 60rem;
  //   // flex-direction: column;
  //   // align-items: stretch;
  //   // justify-content: flex-start;
  // }
  // .message-textarea {
  //   font-size: 1.6rem;
  //   font-family: Avenir, Helvetica, Arial, sans-serif;
  //   padding: 0;
  //   outline: none;
  //   border: none;
  //   resize: none;
  // }
</style>