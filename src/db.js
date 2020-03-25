// Get a RTDB instance
import firebase from 'firebase/app'
import 'firebase/database'

export const db = firebase
  .initializeApp({ databaseURL: 'https://chat-room-eed70.firebaseio.com' })
  .database()