const admin = require('firebase-admin');
const functions = require('firebase-functions');

//const {Storage} = require('@google-cloud/storage');
//const storage = new Storage();
//const bucket = storage.bucket('office-booking-app.appspot.com');

//Initialize Firebase
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const template = require('./htmltemplates');

//function to get booking form and generate list of locations
exports.getBookingForm = (req, res) => {
    var officesList = db.collection('offices').doc('1');
    var getDoc = officesList.get()
        .then(doc => {
            if (!doc.exists) {
                throw new Error("No such document");
            } else {
                const templatedHtml = template.bookingForm({
                    option1: doc.get('option1'),
                    option2: doc.get('option2'),
                    option3: doc.get('option3'),
                    option4: doc.get('option4')
                });

                res.status(200).send(templatedHtml);
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
            res.status(400).send('Error');
        });

}

exports.bookdate = (req, res) => {
  let peopleRef = db.collection('people').doc(req.body.iemail.toString())
  .collection('dates').doc(req.body.idate.toString());
  let setDate = peopleRef.set({
    location: req.body.location.toString(),
    time: req.body.itime.toString(),
    timestamp: Date.now()
  });

  let locationsRef = db.collection('locations').doc(req.body.location.toString())
  .collection('dates').doc(req.body.idate.toString())
  .collection('people').doc(req.body.iemail.toString());
  let setPerson = locationsRef.set({
    time: req.body.itime.toString(),
    timestamp: Date.now()
  });

  res.status(200).send(template.successfulBooking());

}
