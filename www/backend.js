document.addEventListener('DOMContentLoaded', function() {
  window.backend = {}
  backend.user = null
  backend.db = firebase.database()
  backend.eventList = backend.db.ref('events')
  backend.googleProvider = new firebase.auth.GoogleAuthProvider()

  readyForStuff();
})

function createEvent(title, loc, startTime, endTime, lat, long) {
  let newEvent = backend.eventList.push()
  newEvent.set({
      title: title,
      location: loc,
      startTime: startTime,
      endTime: endTime,
      latitude: lat,
      longitude: long,
      interestedUsers: 0,
      attendingUsers: 0,
      creator: backend.user.uid
  })
}

function getEvents(callback) {
  backend.eventList.once('value', function(snapshot) {
    let events = []
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val()
      childData.key = childKey
      events.push(childData)
    });
    callback(events)
  });
}

function logIn(callback) {
  firebase.auth().signInWithPopup(backend.googleProvider).then(function(result) {
    var token = result.credential.accessToken
    var user = result.user

    backend.user = user
    backend.db.ref(`users/${user.uid}`).update({
        name: backend.user.displayName,
        email: backend.user.email.toLowerCase(),
        interestedEvents: {},
        attendingEvents: {}
    })
    callback(backend.user)
   }).catch(function(error) {
    var errorCode = error.code
    var errorMessage = error.message
    var email = error.email
    var credential = error.credential
  })
}

function updateEventInterest(eventId, userId) {
  let event = backend.db.ref(`events/${eventId}`)
  let userIntEvents = backend.db.ref(`users/${userId}/interestedEvents`)
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
  let event = backend.db.ref(`events/${eventId}`)
  let userIntEvents = backend.db.ref(`users/${userId}/interestedEvents`)
  event.transaction(function(event) {
    if (event) {
      event.interestedUsers--
    }
    return event
  })

  backend.db.ref(`users/${userId}/interestedEvents/${eventId}`).remove()
}

function updateEventAttending(eventId, userId) {
  let event = backend.db.ref(`events/${eventId}`)
  let userIntEvents = backend.db.ref(`users/${userId}/attendingEvents`)
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
  let event = backend.db.ref(`events/${eventId}`)
  let userIntEvents = backend.db.ref(`users/${userId}/attendingEvents`)
  event.transaction(function(event) {
    if (event) {
      event.attendingUsers--
    }
    return event
  })

  backend.db.ref(`users/${userId}/attendingEvents/${eventId}`).remove()
}

function getUserInfo(callback) {
  let uid = backend.user.uid
  backend.db.ref(`users/${uid}`)
  .once("value", function(snapshot) {
    let email = snapshot.child('email').val()
    let name = snapshot.child('name').val()
    callback(email, name)
  })
}

function getAttendingEvents(callback) {
  let uid = backend.user.uid
  backend.db.ref(`users/${uid}/attendingEvents`)
  .once('value', function(snapshot) {
    let events = []
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      events.push(childKey)
    });
    callback(events)
  });
}

function getInterestedEvents(callback) {
  let uid = backend.user.uid
  backend.db.ref(`users/${uid}/interestedEvents`)
  .once('value', function(snapshot) {
    let events = []
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      events.push(childKey)
    });
    callback(events)
  });
}

