<template>
  <div class="home">
    <div ref="messagesRef" class="messages-container">
      <div
        v-for="message in messages" 
        :key="message['.key']"
        class="message"
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
            <textarea v-model="editMessageText"/>
          </template>
      </div>
    </div>
    <div class="message-form-container">
      <form class="message-form" @submit="addMessage">
        <textarea id="messageInput" placeholder="message to people" v-model="text" @keydown.enter.prevent="addMessage"/>
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

import {db} from './../db'

export default {
  name: 'Home',
  data() {
    return {
      messages: [],
      nickname: 'Anonymous',
      text: '',
      editMessage: null,
      editMessageText: null,
      showNew: true
    }
  },
  firebase: {
    messages: db.ref('messages')
  },
  methods: {
    addMessage() {
      this.$firebaseRefs.messages.push({
        nickname: this.nickname,
        text: this.text
      })
      this.text = ''
    },
    removeMessage(message) {
      this.$firebaseRefs.messages.child(message[".key"]).remove()
    },
    updateMessage(message) {
      this.$firebaseRefs.messages.child(message[".key"]).update({text: this.editMessageText})
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
    }
  },
  components: {
    // HelloWorld
  },
  mounted() {
    const self = this

    const nicknameInput = prompt('Enter nickname', 'Anonymous')

    debugger

    self.$nextTick(() => {
      self.$refs.messagesRef.scrollTop = self.$refs.messagesRef.scrollHeight - self.$refs.messagesRef.clientHeight
    })

    this.$refs.messagesRef.addEventListener('scroll', e => {
      if(e.target.scrollTop !== e.target.scrollHeight - e.target.clientHeight && self.showNew) self.showNew = false
      else if(e.target.scrollTop === e.target.scrollHeight - e.target.clientHeight && !self.showNew) self.showNew = true
    })

    this.$firebaseRefs.messages.on('child_added', data => {
      if(data.val().nickname !== self.nickname)
        return self.$notify({
          group: 'messages',
          title: 'Message',
          text: `User ${data.val().nickname} added new message`
        })

      if(self.showNew) {
        self.$nextTick(() => {
          self.$refs.messagesRef.scrollTop = self.$refs.messagesRef.scrollHeight - self.$refs.messagesRef.clientHeight
        })
      }
    })
  }
}
</script>

<style lang="scss">
  $scrollbar-width: .3rem;
  :root {
    font-size: 62.5%;
    body {
      margin: 0;
      // Body font size 16px
      font-size: 1.6rem;
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
    border: 1px #E0E0E0 dashed;
  }
  .message-buttons {
    opacity: 0;
    transition: opacity .3s cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:hover {
      .message-buttons {
        opacity: 1;
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
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
  a.button {
    display:inline-block;
    padding:0.3em 1.2em;
    margin:0 0.3em 0.3em 0;
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
  }
  a.button:hover {
    background-color:#4095c6;
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
    padding: 2rem 2rem;
    textarea {
      width: 100%;
      height: 100%;
      padding: .8rem;
      resize: none;
      border-radius: .2rem;
    }
    // min-width: 60rem;
    // flex-direction: column;
    // align-items: stretch;
    // justify-content: flex-start;
  }
</style>