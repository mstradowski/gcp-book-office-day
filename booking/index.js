// Firebase access config
const admin = require('firebase-admin');
const functions = require('firebase-functions');

//const {Storage} = require('@google-cloud/storage');
//const storage = new Storage();
//const bucket = storage.bucket('office-booking-app.appspot.com');

// Initialize Firebase
admin.initializeApp(functions.config().firebase)
const db = admin.firestore();

const template = require('./htmltemplates');

// HTTP function to generate booking form
exports.getBookingForm = (req, res) => {
  //let tablestring = getPersonBookings('myemail@gmail.com');
  //console.log('###tablestring###: ', tablestring);

  // get list of offices from firebase
  let officesList = getDocumentData('offices', '1')
  .then(value => {
    const templatedHtml = template.bookingForm({
      option1: value.get('option1'),
      option2: value.get('option2'),
      option3: value.get('option3'),
      option4: value.get('option4'),
      table: 'table'
    });

    res.status(200).send(templatedHtml);
  })
  .catch(e => {
      console.log(e);
      res.status(400).send('Error');
  });

//TODO:
// - create async function to parallel call functions and return results
// - create async function to parse list of bookings into html template format
// - revrite above to use parallel and parse functions

  console.log('after all');
}

// HTTP funciton to send the booking record to collection 'people'
// and subcollection 'dates'
exports.bookDate = (req, res) => {
  // TODO: add check if person exists (?)
  let peopleRef = db.collection('people').doc(req.body.iemail.toString());
  let setPerson = peopleRef.set({
    email: req.body.iemail.toString(),
    timestamp: Date.now()
  });

  // creates/updates 'dates' subcollection with new/updated date, location,
  // time and last update timestamp
  let dateRef = peopleRef.collection('dates').doc(req.body.idate.toString());
  let setDate = dateRef.set({
    location: req.body.location.toString(),
    time: req.body.itime.toString(),
    timestamp: Date.now()
  });

  res.status(200).send(template.successfulBooking());

}

// Async function to retrieve document from Firebase
// requires collection and document names
// returns document object or throws error
async function getDocumentData(collectionName, documentName) {
  try {
    let documentRef = await db.collection(collectionName).doc(documentName);
    let documentData = await documentRef.get();

    if (!documentData.exists) {
      throw new Error('No such document ' + collectionName + '>'+ documentName);
    } else {
      //console.log('Document:' , documentData.id, '=> data:', documentData.data());
      return documentData;
    }

  } catch (e) {
    throw new Error('Error getting documents: ' + e);
  } finally {
    //console.log('Cleanup');
  }
}

/*
// function to get the list of bookings for specific person
function getPersonBookings(personemail) {
  // get the document of specific person if exists
  let tempstring;
  let personRef = db.collection('people').doc(personemail.toString());
  let getDoc = personRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document: ', personemail.toString());
      } else {
        // find dates subcollections
        personRef.getCollections().then(collections => {
          collections.forEach(collection => {
            if (collection.id == 'dates') {
              tempstring = parseBookings(collection);
              console.log('###tempstring###: ',tempstring);
            }
          });
        });
      }
      return tempstring;
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
}

// function to parse subcollection with booked dates to table format
function parseBookings(datescollection) {
  let tableStr = '<table><thead><tr><th>tableName</th><th>tableName2</th><th>tableName3</th></tr></thead><tbody>';
  let allDates = datescollection.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        // parse data
        console.log('### ', doc.id, '=>', doc.data());
        tableStr += '<tr><td>' + doc.id + '</td>';
        tableStr += '<td>' + doc.data().location + '</td>';
        tableStr += '<td>' + doc.data().time + '</td></tr>';
      });
      tableStr += '</tbody></table>';
      console.log('###tableStr###: ',tableStr);
      return tableStr;
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}
*/
