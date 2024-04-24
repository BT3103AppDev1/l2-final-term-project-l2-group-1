<template>
  <div>
    <h1 id="totalSpending">Total Spending this Month: ${{ totalSpending }}</h1>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      mmyy: "",
      totalSpending: 0,
    };
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.mmyy = this.getMonthYear();
        this.getMonthExp(user.email);
      }
    });
  },

  methods: {
    getMonthYear() {
      const currDateTime = new Date();
      return currDateTime.toLocaleString("default", {
        month: "long",
        year: "2-digit",
      });
    },

    async getMonthExp(email) {
      var currMonthExp = 0;
      const db = getFirestore(firebaseApp);
      const monthYear = this.getMonthYear();
      const currMonthEntries = await getDocs(
        collection(db, email, "logs", monthYear)
      );
      currMonthEntries.forEach((doc) => {
        currMonthExp += parseFloat(doc.data().amount);
      });
      this.totalSpending = currMonthExp;
    },
  },
};
</script>

<style>
#totalSpending {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: #4116b7;
  font-size: 50px;
  text-shadow: 3px 3px rgb(205, 205, 205);
}
</style>

