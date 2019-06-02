const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pottsga.functions@gmail.com',
    pass: 'Functi0nP@ssw0rd'
  }
});

const toEmails = 'pottsga@gmail.com,phelpsmichelle5@gmail.com'

/* Return a formatted date in the MM/DD/YYYY HH:MM:SS AM/PM
 * format
 */
function getFormattedTime(date) {
  return (
    `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` 
    + ` ${date.getHours() > 12 ? date.getHours() - 12 : date.getHours() }:${date.getMinutes()}:${date.getSeconds()}`
    + ` ${date.getHours() > 12 ? 'PM' : 'AM'}`
  );
}

exports.sendEmail = functions.firestore
  .document('rsvps/{rsvpId}')
  .onCreate((snap, context) => {
    const data = snap.data();
    const f_date = getFormattedTime(data.submittedOn.toDate());

    const mailOptions = {
      from: 'pottsga.functions@gmail.com',
      to: toEmails,
      subject: 'RSVP Notification',
      html: `
        <style type="text/css">
          html, body {
            font-family: 'Open Sans', sans-serif;
          }
          table {
            border-collapse: collapse;
            border-radius: 3px;
            margin: 30px;
          }
          thead {
            background: lightgrey;
          }
          table, th, td {
            border: 1px solid black;
          }
          th {
            padding: 2px 10px;
          }
          td {
            padding: 1px 3px;
          }
        </style>

        <h1>
          RSVP Notification
        </h1>
        <p>${data.firstName} ${data.lastName} has RSVP'd.</p>

        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Attending Wedding?</th>
              <th># Adults</th>
              <th># Children</th>
              <th>Attending Reception?</th>
              <th># Adults</th>
              <th># Children</th>
              <th>Attending Wedding Shower?</th>
              <th># Adults</th>
              <th># Children</th>
              <th>Submitted On</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${data.firstName}</td>
              <td>${data.lastName}</td>
              <td>${data.attendingWedding ? '&#10004;' : '&times;'}</td>
              <td>${data.numAdultsAttendingWedding || ''}</td>
              <td>${data.numChildrenAttendingWedding || ''}</td>
              <td>${data.attendingWeddingReception ? '&#10004;' : '&times;'}</td>
              <td>${data.numAdultsAttendingWeddingReception || ''}</td>
              <td>${data.numChildrenAttendingWeddingReception || ''}</td>
              <td>${data.attendingWeddingShower ? '&#10004;' : '&times;'}</td>
              <td>${data.numAdultsAttendingWeddingShower || ''}</td>
              <td>${data.numChildrenAttendingWeddingShower || ''}</td>
              <td>${f_date}</td>
            </tr>
          </tbody>
        </table>

        <p>Go to <a href="https://wedding-119cf.firebaseapp.com/">https://wedding-119cf.firebaseapp.com</a> to see all RSVPs.</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    return 1;
  });
