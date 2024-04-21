<template>
  <div>
    <h1 id="Current">Logbook!</h1>

    <table id="table" class="auto-index">
      <tr>
        <th>S/N</th>
        <th>Amount</th>
        <th>Category</th>
        <th>Subcategory</th>
        <th>Date</th>
        <th>Options</th>
      </tr>
      <!-- Now the coin data to come from data property,'tablerows', instead of javascript -->
      <!-- We will not use insert Row and insertcell etc.. -->
      <!-- :key acts as a unique idenfier to create rows -->
      <tr v-for="(row, index) in tableRows" :key="row.documentId">
        <td>{{ index + 1 }}</td>
        <td>{{ row.amount }}</td>
        <td>{{ row.category }}</td>
        <td>{{ row.subcategory }}</td>
        <td>{{ row.date }}</td>
        <td>
          <button @click="deleteInstrument(row.documentId)" class="bwt">Delete</button>
        </td>
      </tr>
    </table>
    <br />
    <br />

    <h2 id="totalProfit"> Total Expenses for Current Month : {{ totalProfit }} USD</h2>
  </div>
</template>

<script>

import firebaseApp from '../firebase.js';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      useremail: '',
      tableRows: [],
      totalProfit: 0,
    };
  },

  async mounted() {
    const auth = getAuth();
    console.log("Auth: ", auth)
    this.useremail = auth.currentUser.email;
    console.log("User email: ", this.useremail)
    await this.fetchAndUpdateData(this.useremail);
  },

  methods: {
    getMonthYear() {
      const currDateTime = new Date();
      return currDateTime.toLocaleString("default", {
        month: "long",
        year: "2-digit",
      });
    },

    findMonthYearByDocumentId(documentId) {
    const entry = this.tableRows.find(row => row.documentId === documentId);
    return entry ? entry.monthYear : null;  // returns the monthYear if found, else returns null
    },

    async fetchAndUpdateData(useremail) {
      const months = [
        "January ",
        "February ",
        "March ",
        "April ",
        "May ",
        "June ",
        "July ",
        "August ",
        "September ",
        "October ",
        "November ",
        "December ",
      ];
      const allMonthEntries = doc(db, this.useremail, "logs");
      const currDateTime = new Date();
      var monthIter = "";
      this.tableRows = []
      this.totalProfit = 0;

      for (
        let i = currDateTime.getMonth() + 1;
        i < currDateTime.getMonth() + 13;
        i++
      ) {
        if (i < 12) {
          monthIter =
            months[i] +
            (parseInt(
              currDateTime.toLocaleString("default", { year: "2-digit" })
            ) -
              1);
        } else {
          monthIter =
            months[i - 12] +
            currDateTime.toLocaleString("default", { year: "2-digit" });
        }
        let monthData = await getDocs(collection(allMonthEntries, monthIter));
        console.log(monthData)

        const newRows = await Promise.all(monthData.docs.map(async(doc) => {
          let documentData = doc.data();

          let amount = documentData.amount;
          let category = documentData.category;
          let subcategory = documentData.subcategory;
          let date = documentData.date;
          let monthYear = monthIter;
          const sanitizedDate = date.replace(/[-\/\s:]/g, '');
          const sanitizedSubcat = subcategory.replace(/[\s\/]+/g, '_'); // Replace spaces and slashes with underscores
          const documentId = `${amount}_${sanitizedDate}_${sanitizedSubcat}`;

          console.log("Amount ", amount, "Category: ", category, "Subcategory: ", subcategory, "Date: ", date)
          this.totalProfit += amount;

          return {
            amount,
            category,
            subcategory,
            date,
            monthYear,
            totalProfit,
            documentId
          };
        }),
      );  
      this.tableRows = this.tableRows.concat(newRows)
      console.log(this.tableRows)
      }
    },  

    async deleteInstrument(documentId) {
      // Retrieve the authentication state
      const auth = getAuth();
      if (!auth.currentUser) {
        console.error("No user is currently logged in.");
        return; // Stop execution if no user is logged in
      }

      // Get the current user's email
      const userEmail = auth.currentUser.email;

      // Construct the document reference
      try {
        // Delete the document
        const monthYear = this.findMonthYearByDocumentId(documentId)
        await deleteDoc(doc(db, userEmail, "logs", monthYear, documentId));
        console.log("Document successfully deleted!", documentId);

        // Refresh the table data and total profit
        await this.fetchAndUpdateData(this.useremail);
      } catch (error) {
        console.error("Error deleting document:", error);
      }
}

  },
};
</script>

<style>
h2 {
  text-align: center;
  /* background-color: rgb(130,130,130); */
  font: 700;
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
h1 {
  text-align: center;
  /* background-color: rgb(130,130,130); */
  font: 1500;
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
table {

  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

tr:nth-child(even) {
  background-color: #e3edee;
}

th,td {
  border: 1px solid #dddddd;
  text-align: center;
  padding: 8px;
}

.bwt{
    color:rgb(243, 236, 236);
    background-color: rgb(255, 94, 0);
}

</style>
