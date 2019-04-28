document.addEventListener('DOMContentLoaded', function() {
  try {
    let app = firebase.app();
    let db = firebase.firestore();

    db.collection('rsvps').orderBy('lastName', 'asc').get()
      .then(docs => {
        docs.forEach(doc => {
          const data = doc.data();
          const date = data.submittedOn.toDate()
          const f_date = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()} ${date.getHours() > 12 ? 'AM' : 'PM' }`

          const row = `
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
          `;

          document.querySelector('#rsvpTable tbody').innerHTML += row;
        });
      });


    db.collection("rsvps").get()
      .then(docs => {

        let weddingInfo = { count: { adults: 0, children: 0 } }
        let receptionInfo = { count: { adults: 0, children: 0 } }
        let showerInfo = { count: { adults: 0, children: 0 } }

        docs.forEach(doc => {
          const data = doc.data();

          // Populate count info
          if (data.attendingWedding) {
            weddingInfo.count.adults += data.numAdultsAttendingWedding;
            weddingInfo.count.children += data.numChildrenAttendingWedding;
          }

          if (data.attendingWeddingReception) {
            receptionInfo.count.adults += data.numAdultsAttendingWeddingReception;
            receptionInfo.count.children += data.numChildrenAttendingWeddingReception;
          }

          if (data.attendingWeddingShower) {
            showerInfo.count.adults += data.numAdultsAttendingWeddingShower;
            showerInfo.count.children += data.numChildrenAttendingWeddingShower;
          }
        })

        return { weddingInfo, receptionInfo, showerInfo }
      })
     .then(result => {
        const row = `
          <tr>
            <td>${result.weddingInfo.count.adults}</td>
            <td>${result.weddingInfo.count.children}</td>
            <td>${result.weddingInfo.count.adults + result.weddingInfo.count.children}</td>
            <td>${result.receptionInfo.count.adults}</td>
            <td>${result.receptionInfo.count.children}</td>
            <td>${result.receptionInfo.count.adults + result.receptionInfo.count.children}</td>
            <td>${result.showerInfo.count.adults}</td>
            <td>${result.showerInfo.count.children}</td>
            <td>${result.showerInfo.count.adults + result.showerInfo.count.children}</td>
          </tr>
        `;

        document.querySelector('#infoTable tbody').innerHTML += row;
      });
  } catch (e) {
    console.error(e);
  }
});
