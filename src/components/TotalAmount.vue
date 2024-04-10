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
/* Your styles here */
</style>
