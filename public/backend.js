document.addEventListener('DOMContentLoaded', function() {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  window.db = firebase.database()
  window.eventList = db.ref('events')
  window.googleProvider = new firebase.auth.GoogleAuthProvider()
})

function createEvent(title, loc, startTime, endTime) {
  let newEvent = eventList.push()
  newEvent.set({
      title: title,
      location: loc,
      startTime: startTime,
      endTime: endTime
    })
}

function getEvents() {
  eventList.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val()
      console.log(childKey, childData)
    });
  });
}

function logIn() {
  firebase.auth().signInWithPopup(googleProvider).then(function(result) {
    var token = result.credential.accessToken
    var user = result.user

    window.user = user
    db.ref(`users/${user.uid}`).update({
        name: user.displayName,
        email: user.email.toLowerCase(),
    })

   }).catch(function(error) {
    var errorCode = error.code
    var errorMessage = error.message
    var email = error.email
    var credential = error.credential
  })
}
