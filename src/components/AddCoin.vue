<template>
  <div class="container">
    <form id="myform">
      <h2 id="Header">Add Expenditure</h2>

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
import { setDoc, doc, collection } from "firebase/firestore";
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
      } else if (
        (this.amt.length === 0) |
        (this.cat.length === 0) |
        (this.subcat.length === 0) |
        (this.date.length === 0)
      ) {
        alert("One or more fields are empty.");
        return;
      }

      const userEmail = auth.currentUser.email;
      console.log(this.getMonthYearOfEntry());

      try {
        const docRef = doc(
          collection(db, userEmail, "logs", this.getMonthYearOfEntry())
        );
        const newDocId = docRef.id;

        await setDoc(docRef, {
          documentId: newDocId,
          amount: this.amt,
          category: this.cat,
          date: this.date,
          subcategory: this.subcat,
        });

        console.log("Document written with ID: ", newDocId);
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
#Header {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: #4116b7;
  font-size: 45px;
  text-shadow: 3px 3px rgb(205, 205, 205);
}
.container {
  max-width: 600px; /* Or whatever maximum width you prefer */
  margin: auto; /* Center the container */
  padding: 20px;
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 20px; /* Space out each form group */
}

label {
  color: #4321a0;
  display: inline-block;
  font-size: 20px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  width: 30%; /* Adjust the width as necessary */
  text-align: right;
  margin-right: 10px; /* Space between label and input */
}

input[type="number"],
input[type="text"],
input[type="date"],
select {
  width: 65%; /* Adjust the width as necessary */
  padding: 5px;
  color: #4321a0;
  box-sizing: border-box;
}

.save {
  background-color: white;
}

#savebutton {
  width: 40%;
  padding: 15px;
  margin: 10px 0;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 16px;
  font-weight: bold;
  background-image: linear-gradient(to right, #8414ec, #740ccc, #4116b7);
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

#savebutton:hover {
  /* background-color: #4f339c; */
  box-shadow: 3px 3px grey;
}
</style>
