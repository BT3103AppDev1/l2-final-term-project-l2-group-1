<template>
  <h1 id="Current">Current portfolio</h1>
  
  <table id="table" class="auto-index">
    <tr>
      <th>S.No</th> 
      <th>Coin</th> 
      <th>Ticker</th> 
      <th>Buy_Price</th> 
      <th>Buy_Quantity</th> 
      <th>Current_Price</th> 
      <th>Profit</th> 
      <th>Options</th>
    </tr> 
    <tr v-for="(row, index) in tableRows" :key="row.id">
      <td>{{ index + 1 }}</td>
      <td>{{ row.Coin }}</td>
      <td>{{ row.Ticker }}</td>
      <td>{{ row.Buy_Price }}</td>
      <td>{{ row.Buy_Quantity }}</td>
      <td>{{ row.currentPrice }}</td>
      <td>{{ row.profit }}</td>
      <td>
        <button @click="deleteInstrument(row.id, row.Coin)" class="bwt">Delete</button>
      </td>
    </tr>
  </table><br><br>

  <h2 id="totalProfit">Total Profit is : ${{ totalProfit }}</h2>
</template>

<script>
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ccxt from "ccxt";

const db = getFirestore();

export default {
  data() {
    return {
      useremail: null,
      tableRows: [],
      totalProfit: 0,
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.useremail = user.email;
        this.fetchAndUpdateData();
      }
    });
  },
  methods: {
    async fetchAndUpdateData() {
      this.totalProfit = 0;
      if (this.useremail) {
        const allDocuments = await getDocs(collection(db, this.useremail));
        this.tableRows = allDocuments.docs.map((doc) => {
          let data = doc.data();
          data.id = doc.id;
          this.calculateProfit(data);
          return data;
        });
      }
    },
    async calculateProfit(coin) {
      let binance = new ccxt.binance();
      let x = await binance.fetch_ohlcv(coin.Ticker, "5m");
      coin.currentPrice = x[499][4];
      coin.profit = Math.round(coin.Buy_Quantity * (parseFloat(coin.currentPrice) - parseFloat(coin.Buy_Price)));
      this.totalProfit += parseFloat(coin.profit);
    },
    async deleteInstrument(coinId, coinName) {
      alert("You are going to delete: " + coinName) 
      await deleteDoc(doc(db, this.useremail, coinId));
      console.log("Document successfully deleted!", coinName);
      this.fetchAndUpdateData();
    },
  }
};
</script>

<style>
h1, h2 {
  text-align: center;
  background-color: rgb(129, 184, 99);
  font: 700;
  display: block; 
  font-size: 2em;
  margin-block-start: 0.67em; 
  margin-block-end: 0.67em; 
  margin-inline-start: 0px; 
  margin-inline-end: 0px;
  font-weight: bold;
}

table {
  font-family: arial, 
  sans-serif; 
  border-collapse: collapse;
  width: 100%;
}

tr:nth-child(even) {
  background-color:#e3edee;
}

th,td {
  border: 1px solid #dddddd;
  text-align: center;
  padding: 8px;
}

.bwt {
  color: rgb(243, 236, 236); 
  background-color: rgb(255, 94, 0);
}

</style>