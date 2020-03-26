<template>
  <div class="home">
    <div ref="messagesRef" class="messages-container">
      <a 
        class="button"
        :disabled="loadMoreDisabled"
        @click="!loadMoreDisabled ? loadMore() : null"  
      >Load more</a>
      <div
        v-for="message in messagesArray" 
        :key="message.id"
        class="message"
        :class="editMessage === message ? 'message--editing' : ''"
      >
        <div class="message-header">
          <div class="message-nickname">{{message.nickname}}</div>
          <div class="message-buttons">
            <template v-if="editMessage !== message">
              <a class="button" @click="edit(message)">edit</a>
              <a class="button" @click="removeMessage(message)">remove</a>
            </template>
            <template v-else>
              <a class="button" @click="cancelEdit">cancel edit</a>
              <a class="button" @click="updateMessage(message)">save</a>
            </template>
          </div>
        </div>
        <template v-if="editMessage !== message">
          <div class="message-text">{{message.text}}</div>
        </template>
        <template v-else>
          <textarea 
            v-focus
            class="message-textarea"
            rows="1"
            v-model.trim="editMessageText"
            @keydown.enter.prevent="updateMessage(message)"
            @keydown.esc.prevent="cancelEdit"
          />
        </template>
      </div>
    </div>
    <div class="message-form-container">
      <form class="message-form" @submit="addMessage">
        <textarea id="messageInput" placeholder="message to people" v-model.trim="text" @keydown.enter.prevent="addMessage"/>
      </form>
    </div>
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
/* eslint-disable */
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import {firebaseData} from './../firebaseConfig'

const messagesRef = firebaseData.ref('messages')

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
    messagesArray() {
      return Object.keys(this.messages).map(key => ({...this.messages[key], id: key}))
    },
    scrollToBottom() {
      return this.isMobile || this.showNew
    }
  },
  methods: {
    addMessage() {
      if(this.text) {
        messagesRef.push({
          nickname: this.nickname,
          text: this.text
        })
        this.text = ''
      }
    },
    removeMessage(message) {
      messagesRef.child(message.id).remove()
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
      this.$refs.messagesRef.scrollTop = this.$refs.messagesRef.scrollHeight - this.$refs.messagesRef.clientHeight
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
        const newKey = snapshot.key,
              newMessage = snapshot.val()

        if(self.messages[newKey]) return

        this.$set(this.messages, newKey, newMessage)
        if(newMessage.nickname !== self.nickname)
          self.$notify({
            group: 'messages-success',
            title: 'Message',
            text: `User ${newMessage.nickname} added new message`
          })

        if(self.scrollToBottom) {
          self.$nextTick(() => self.scrollBottom())
        }
      })
      messagesRef.on('child_removed', snapshot => {
        const removedKey = snapshot.key,
              removedMessage = snapshot.val()
        
        self.$delete(self.messages, removedKey)

        // if(self.messagesArray.length < self.minSize) self.requestLastNItems(self.minSize)

        if(removedMessage.nickname !== self.nickname)
          return self.$notify({
            group: 'messages-error',
            title: 'Message',
            text: `User ${removedMessage.nickname} removed message`
          })
      })

      messagesRef.on('child_changed', snapshot => {
        debugger
        const changedKey = snapshot.key,
              changedMessage = snapshot.val()

        self.messages[changedKey] = changedMessage

        if(changedMessage.nickname !== self.nickname)
          return self.$notify({
            group: 'messages-warning',
            title: 'Message',
            text: `User ${changedMessage.nickname} edited message`
          })
      })
    })
  },
  mounted() {
    const self = this

    if(!self.isMobile)
      self.$refs.messagesRef.addEventListener('scroll', this.showNewHandler)
  }
}
</script>

<style lang="scss">
  $scrollbar-width: .3rem;
  :root {
    @media screen and (min-width: 600px) {
      font-size: 62.5%;
    }
    body {
      margin: 0;
      // Body font size 16px
      font-size: 1.6rem;
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
  .messages-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    height: 80vh;
    padding-top: .8rem;
    padding-right: $scrollbar-width;
    border-right: $scrollbar-width solid transparent;
    overflow-y: hidden;
    &:hover {
      overflow-y: scroll;
      border-right: none;
    }
    // margin: 8rem;
  }
  .message {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: .8rem;
    margin: .8rem;
    border: .1rem #E0E0E0 dashed;
    &--editing {
      border-width: .2rem;
      border-color: #BDBDBD;
    }
  }
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media screen and (min-width: 600px) {
      &:hover {
        .message-buttons {
          opacity: 1;
        }
      } 
      .message-buttons {
        opacity: 0;
        transition: opacity .3s cubic-bezier(0.075, 0.82, 0.165, 1);
      }  
    }
  }
  .message-nickname {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #616161;
    font-weight: 600;
  }
  .message-text {
    // display: flex;
    // justify-content: flex-start;
    // align-items: flex-start;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  a.button {
    display:inline-block;
    padding:0.3em 1.2em;
    margin:0 0.3em 0;
    border-radius:2em;
    box-sizing: border-box;
    text-decoration:none;
    font-family:'Roboto',sans-serif;
    font-weight:300;
    color:#FFFFFF;
    background-color:#4eb5f1;
    text-align:center;
    transition: all 0.2s;
    cursor: pointer;
    &:hover:not([disabled]) {
      background-color:#4095c6;
    }
    &[disabled] {
      cursor: not-allowed;
      background-color: #828282;
      color: #F2F2F2;
    }
  }
  @media all and (max-width:30em) {
    a.button {
      display:block;
      margin:0.2em auto;
    }
  }
  .message-form-container {
    display: flex;
    justify-content: center;
    align-items: stretch;
    height: 20vh;
    overflow: hidden;
    // margin: 16rem;
  }
  .message-form {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 2rem .8rem;
    textarea {
      width: 100%;
      height: 100%;
      padding: .8rem;
      resize: none;
      border-radius: .2rem;
      font-size: 1.6rem;
    }
    // min-width: 60rem;
    // flex-direction: column;
    // align-items: stretch;
    // justify-content: flex-start;
  }
  .message-textarea {
    font-size: 1.6rem;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    padding: 0;
    outline: none;
    border: none;
    resize: none;
  }
</style>