<template>
  <div>
    <h1 id="totalProfit">Total Profit is: {{ totalProfit }} USD</h1>
  </div>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      totalProfit: 0,
    };
  },

  async mounted() {
    const auth = getAuth();
    this.useremail = auth.currentUser.email;
    await this.fetchAndUpdateData(this.useremail);
  },

  methods: {
    async fetchAndUpdateData(useremail) {
      let allDocuments = await getDocs(collection(db, String(useremail)));

      let totalProfit = 0;

      allDocuments.forEach(doc => {
        let documentData = doc.data();
        let coin = documentData.Amount; // this coin thing doesn't sum when the input is a number :(

        totalProfit += coin;
      });

      this.totalProfit = totalProfit;
    },
  },
};
</script>

<style>
#totalProfit {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: #4116b7;
  font-size: 50px;
  text-shadow: 3px 3px rgb(205, 205, 205);
}
</style>
