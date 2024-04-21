<template>
  <div class="container">
    <form id="myform">
      <h2>Add Coins</h2>

      <div class="formli">
        <label for="amt">Amount:</label>
        <input type="number" id="amt" required="" v-model="amt" />
        <br /><br />

        <label for="cat">Category: </label>
        <select id="cat" required="" v-model="cat">
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
        <br />

        <label for="subcat">Subcategory: </label>
        <input type="text" id="buy1" required="" v-model="subcat" /><br /><br />
        <label for="date">Date of Spending: </label>
        <input type="date" id="date" required="" v-model="date" /><br /><br />

        <div class="save">
          <button id="savebutton" type="button" v-on:click="savetofs">
            Log it in!
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import { setDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      amt: "",
      cat: "",
      subcat: "",
      date: "",
    };
  },

  methods: {
    getMonthYearOfEntry() {
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
      return (
        months[parseInt(this.date.slice(5, 7)) - 1] + this.date.slice(2, 4)
      );
    },

    async savetofs() {
      console.log("Saving to Firestore");
      const auth = getAuth();

      if (!auth.currentUser) {
        console.error("No user is currently logged in.");
        return; // Stop execution if no user is logged in
      }

      const userEmail = auth.currentUser.email;
      console.log(this.getMonthYearOfEntry());
      
      try {
      const sanitizedDate = this.date.replace(/[-\/\s:]/g, '');
      const sanitizedSubcat = this.subcat.replace(/[\s\/]+/g, '_'); // Replace spaces and slashes with underscores

      const customDocId = `${this.amt}_${sanitizedDate}_${sanitizedSubcat}`;

        await setDoc(
          doc(db, userEmail, "logs", this.getMonthYearOfEntry(), customDocId),
          {
            amount: this.amt,
            category: this.cat,
            date: this.date,
            subcategory: this.subcat,
          }
        );

        console.log("Document written with ID: ", customDocId);
        this.amt = "";
        this.cat = "";
        this.subcat = "";
        this.date = ""; // Reset Vue data properties
        this.$emit("added"); // Notify any parent components
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    },

  },
};
</script>

<style scoped>
.formli {
  display: inline-block;
  text-align: right;
}

form {
  text-align: center;
  align-items: center;
  margin: auto;
}

input {
  border: 2px solid red;
  border-radius: 4px;
}

.save {
  text-align: center;
}

.container {
  background-color: #00004b;
  color: azure;
}

option {
  color: navy;
}
</style>
