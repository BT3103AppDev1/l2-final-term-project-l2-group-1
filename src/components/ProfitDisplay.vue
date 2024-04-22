<template>
  <div>
    <h1 id="Current">Logbook!</h1>

    <div>
      <label for="startMonth">Start Month:</label>
      <input type="month" id="startMonth" v-model="startMonth">
      <label for="endMonth">End Month:</label>
      <input type="month" id="endMonth" v-model="endMonth">
      <button @click="fetchAndUpdateData(useremail)">Filter</button>
    </div>

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
          <button @click="editInstrument(row)" class="edit">Edit</button>
        </td>
      </tr>
    </table>

    <br />
    <br />

    <h2 id="totalProfit"> Total Expenses for Current Month : {{ totalProfit }} USD</h2>

    <div v-if="isEditing">
      <form @submit.prevent="updateDocument">
        <input type="number" v-model="amt" placeholder="Amount" />
        <select v-model="cat">
          <option disabled value="">Please select a category</option>
          <option value="Mortgage or rent">Mortgage or rent</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Utilities">Utilities</option>
          <option value="Subscriptions">Subscriptions</option>
          <option value="Personal expenses">Personal expenses</option>
          <option value="Savings and investments">
            Savings and investments
          </option>
          <option value="Debt or student loan payments">
            Debt or student loan payments
          </option>
          <option value="Health care">Health care</option>
          <option value="Miscellaneous expenses">Miscellaneous expenses</option>
        </select>
        <input type="text" v-model="subcat" placeholder="Subcategory" />
        <input type="date" v-model="date" placeholder="Date" />
        <button type="submit">Save Changes</button>
        <button @click="clearForm">Cancel</button>
      </form>
    </div>

  </div>
</template>

<script>

import firebaseApp from '../firebase.js';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, doc, deleteDoc, setDoc} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      useremail: '',
      tableRows: [],
      totalProfit: 0,
      amt: "",
      cat: "",
      subcat: "",
      date: "",
      editingDocumentId: null,
      isEditing: false,
      startMonth: '',
      endMonth: ''
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

    findMonthYearByDocumentId(documentId) {
    const entry = this.tableRows.find(row => row.documentId === documentId);
    return entry ? entry.monthYear : null;  // returns the monthYear if found, else returns null
    },

    async fetchAndUpdateData(useremail) {
      this.tableRows = [];  // Clear current data
      this.totalProfit = 0;

      let startDate, endDate;
      // Check if both start and end months are provided
      if (this.startMonth && this.endMonth) {
        startDate = new Date(this.startMonth + '-01'); // Start of the start month
        endDate = new Date(this.endMonth + '-01');
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(endDate.getDate() - 1); // End of the end month
      }

      // Loop through the months of the current year or the filtered range
      const startLoopDate = startDate || new Date(new Date().getFullYear(), 0, 1);  // Start from January of the current year if no filter is set
      const endLoopDate = endDate || new Date(new Date().getFullYear(), 11, 31);  // End at December of the current year if no filter is set

      for (let d = new Date(startLoopDate); d <= endLoopDate; d.setMonth(d.getMonth() + 1)) {
        let monthYear = this.getMonthYearFromDate(d);
        let monthData = await getDocs(collection(db, this.useremail, "logs", monthYear));
        
        monthData.docs.forEach(doc => {
          let documentData = doc.data();
          let docDate = new Date(documentData.date);
          // Filter by date range if both start and end dates are set
          if (!startDate || (docDate >= startDate && docDate <= endDate)) {
            let amount = documentData.amount;
            let category = documentData.category;
            let subcategory = documentData.subcategory;
            let date = documentData.date;
            let documentId = documentData.documentId;

            this.tableRows.push({
              amount,
              category,
              subcategory,
              date,
              monthYear,
              totalProfit: this.totalProfit += amount,
              documentId
            });
          }
        });
      }
      this.tableRows.sort((a, b) => new Date(b.date) - new Date(a.date));
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
    },

    async editInstrument(row) {
      this.amt = row.amount;
      this.cat = row.category;
      this.subcat = row.subcategory;
      this.date = row.date;
      this.editingDocumentId = row.documentId; 
      this.isEditing = true; // Toggle editing state, form for editing pops up
    },

    async updateDocument() {
      if (!this.editingDocumentId) {
        console.error("No document selected for editing.");
        return;
      }

      const newMonthYear = this.getMonthYearFromDateString(this.date); 
      const oldMonthYear = this.findMonthYearByDocumentId(this.editingDocumentId);

      try {
        // If the month/year has changed, move the document to the new collection
        if (newMonthYear !== oldMonthYear) {
          // Create new document in the new collection
          const newDocRef = doc(collection(db, this.useremail, "logs", newMonthYear));
          const newDocRefId = newDocRef.id;
          await setDoc(newDocRef, {
            documentId: newDocRefId,
            amount: this.amt,
            category: this.cat,
            date: this.date,
            subcategory: this.subcat
          });

          // Delete the old document
          const oldDocRef = doc(db, this.useremail, "logs", oldMonthYear, this.editingDocumentId);
          await deleteDoc(oldDocRef);
        } else {
          // Update the document in the same collection
          const documentRef = doc(db, this.useremail, "logs", oldMonthYear, this.editingDocumentId);
          const documentRefId = documentRef.id;
          await setDoc(documentRef, {
            documentId: documentRef.id,
            amount: this.amt,
            category: this.cat,
            date: this.date,
            subcategory: this.subcat
          }, { merge: true });
        }

        console.log("Document updated successfully.");
        this.clearForm();
        await this.fetchAndUpdateData(this.useremail);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    },

    // Helper method to derive MonthYear from a date string
    getMonthYearFromDateString(dateStr) {
      const date = new Date(dateStr);
      return this.getMonthYearFromDate(date);
    },

    getMonthYearFromDate(date) {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const year = date.getFullYear().toString().substr(-2); // Get last two digits of the year
      const month = monthNames[date.getMonth()];
      return `${month} ${year}`;
    },


    clearForm() {
      this.amt = '';
      this.cat = '';
      this.subcat = '';
      this.date = '';
      this.editingDocumentId = null;
      this.isEditing = false;
    },

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

.edit {
  background-color: blue;
  color: white;
}

</style>
