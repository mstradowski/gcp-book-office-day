// Template file that the server will use to inject the HTML markup and
// initial state before sending it to the client

const template = ({
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

module.exports = template;
