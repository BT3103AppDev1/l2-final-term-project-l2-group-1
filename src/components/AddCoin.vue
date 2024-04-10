<template>
  <div class="container">
    <form id="myform">
      <h2>Add Coins</h2>

      <div class="formli">
        <label for="coin1">Amount:</label>
        <input type="number" id="coin1" required="" v-model="coin"> <br><br>


        <label for="ticker1">Category: </label>
        <select id="ticker1" required="" v-model="ticker">
          <option disabled value="">Please select a category</option>
          <option value="Mortgage or rent">Mortgage or rent</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Utilities">Utilities</option>
          <option value="Subscriptions">Subscriptions</option>
          <option value="Personal expenses">Personal expenses</option>
          <option value="Savings and investments">Savings and investments</option>
          <option value="Debt or student loan payments">Debt or student loan payments</option>
          <option value="Health care">Health care</option>
          <option value="Miscellaneous expenses">Miscellaneous expenses</option>
        </select>
        <br>

        <label for="buy1">Subcategory: </label>
        <input type="text" id="buy1" required="" v-model="buyPrice"><br><br>
        <label for="quant1">Date of Spending: </label>
        <input type="date" id="quant1" required="" v-model="buyQuantity"><br><br>

        <div class="save">
          <button id="savebutton" type="button" v-on:click="savetofs"> Log it in! </button>
        </div>
      </div>
    </form>
  </div>
</template>


<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, setDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const db = getFirestore(firebaseApp);

export default {

  data() {
    return {
      coin: "", ticker: "", buyPrice: "", buyQuantity: "", useremail: ""
    }
  },

  methods: {
    async savetofs() {
      console.log("Saving to Firestore")

      const auth = getAuth();
      console.log("Auth: ", auth.currentUser);
      this.useremail = auth.currentUser.email;
      console.log("User's email: ", this.useremail);

      const uniqueID = `${this.buyQuantity}_${this.ticker}_${this.buyPrice}_${this.coin}`
      alert(" Saving your data for Coin : " + uniqueID)

      try {
        const docRef = await setDoc(doc(db, String(this.useremail), uniqueID), { // make unique ID
          Amount: this.coin, Category: this.ticker, Subcategory: this.buyPrice, Date: this.buyQuantity
        })

        if (docRef) {
          console.log("Document ref ID: ", docRef.id);
        } else {
          console.error("Document reference is undefined");
        }
        document.getElementById('myform').reset();
        this.$emit("added");
        // console.log("Document ref ID: ", docRef.id)
        // document.getElementById('myform').reset();
        // this.$emit("added")
      }
      catch (error) {
        console.error("Error adding document: ", error);
      }
    }
    

  }
}


</script>

<style scoped>
/* h2{
background-color: rgb(129, 184,99);
} */

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
  background-color: #00004B;
  color: azure;
}

option {
  color: navy;
}
</style>