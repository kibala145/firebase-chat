import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyDefialhwGz34Hl5nR6Prc_6_he4ZAkzHo",
  authDomain: "chat-room-eed70.firebaseapp.com",
  databaseURL: "https://chat-room-eed70.firebaseio.com",
  projectId: "chat-room-eed70",
  storageBucket: "chat-room-eed70.appspot.com",
  messagingSenderId: "806392955157",
  appId: "1:806392955157:web:579074ed17cf005010291c",
  measurementId: "G-MVKTHTVSTZ"
}

export const firebaseApp = firebase.initializeApp(firebaseConfig)