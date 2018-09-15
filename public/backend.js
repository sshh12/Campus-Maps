document.addEventListener('DOMContentLoaded', function() {
  window.backend = {}
  bakckend.db = firebase.database()
  backend.eventList = db.ref('events')
  backend.window.googleProvider = new firebase.auth.GoogleAuthProvider()
})

function createEvent(title, loc, startTime, endTime) {
  let newEvent = eventList.push()
  newEvent.set({
      title: title,
      location: loc,
      startTime: startTime,
      endTime: endTime,
      interestedUsers: 0,
      attendingUsers: 0,
      creator: user.uid
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
        interestedEvents: {},
        attendingEvents: {}
    })

   }).catch(function(error) {
    var errorCode = error.code
    var errorMessage = error.message
    var email = error.email
    var credential = error.credential
  })
}

function updateEventInterest(eventId, userId) {
  let event = db.ref(`events/${eventId}`)
  let userIntEvents = db.ref(`users/${userId}/interestedEvents`)
  event.transaction(function(event) {
    if (event) {
      event.interestedUsers++
    }
    return event
  })

  let newEvent = {}
  newEvent[eventId] = true
  userIntEvents.update(newEvent)
}

function updateNotEventInterest(eventId, userId) {
  let event = db.ref(`events/${eventId}`)
  let userIntEvents = db.ref(`users/${userId}/interestedEvents`)
  event.transaction(function(event) {
    if (event) {
      event.interestedUsers--
    }
    return event
  })

  db.ref(`users/${userId}/interestedEvents/${eventId}`).remove()
}

function updateEventAttending(eventId, userId) {
  let event = db.ref(`events/${eventId}`)
  let userIntEvents = db.ref(`users/${userId}/attendingEvents`)
  event.transaction(function(event) {
    if (event) {
      event.attendingUsers++
    }
    return event
  })

  let newEvent = {}
  newEvent[eventId] = true
  userIntEvents.update(newEvent)
}

function updateNotEventAttending(eventId, userId) {
  let event = db.ref(`events/${eventId}`)
  let userIntEvents = db.ref(`users/${userId}/attendingEvents`)
  event.transaction(function(event) {
    if (event) {
      event.attendingUsers--
    }
    return event
  })

  db.ref(`users/${userId}/attendingEvents/${eventId}`).remove()
}
