const admin = require('firebase-admin');
const functions = require('firebase-functions');

//Initialize Firebase
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

//HTML Template for locations
let location_template = ({
    id,
    option1,
    option2,
    option3,
    option4
}) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
        </head>
        <body>
          <h2>Welcome to office booking app</h2>
          <form name="bookform" action="/bookdate" method="POST">
            <p>Please select office location:</p>
            <select name="location">
                <option value="1">${option1}</option>
                <option value="2">${option2}</option>
                <option value="3">${option3}</option>
                <option value="4">${option4}</option>
            </select>
            <p>email:</p>
            <input type="text" id="iemail" name="iemail">
            <p>Date:</p>
            <input type="text" id="idate" name="idate">
            <p>Time:</p>
            <input type="text" id="itime" name="itime">
            <input name="submit" type="submit"/>
          </form>
        </body>
      </html>`;
}

//// TODO: export HTML templates to external files

//HTML Template for successful booking
let successful_booking_template = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
        </head>
        <body>
          <h2>Welcome to office booking app</h2>
          <p>Great. <a href="/getBookingForm">Book another day</a></p>
        </body>
      </html>`;
}

//function to get booking form and generate list of locations
exports.getBookingForm = (req, res) => {
    var officesList = db.collection('offices').doc('1');
    var getDoc = officesList.get()
        .then(doc => {
            if (!doc.exists) {
                throw new Error("No such document");
            } else {
                //console.log('Document data:', doc.data());
                res.status(200).send(location_template({
                    option1: doc.get('option1'),
                    option2: doc.get('option2'),
                    option3: doc.get('option3'),
                    option4: doc.get('option4')
                }));
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

  res.status(200).send(successful_booking_template());

}
