// Template file that the server will use to inject the HTML markup and
// initial state before sending it to the client

//HTML Template for booking form
const booking_form_template = ({
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
  </html>
  `;
};

//HTML Template for successful booking
const successful_booking_template = () => {
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

module.exports.bookingForm = booking_form_template;
module.exports.successfulBooking = successful_booking_template;
