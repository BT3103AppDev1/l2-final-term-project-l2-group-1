<template>
  <div style="text-align: center" v-if="user">
    <NavBar />

    <h2>FinWise</h2>
    <h3>My spending for {{ mmyy }}.</h3>
    <div id="graph-container">
      <div id="pie-container">
        <pie-chart class="user" :data="pieData"></pie-chart>
      </div>
      <div id="bar-container">
        <column-chart class="user" :data="colData"></column-chart>
      </div>
    </div>
    <LogOut /> <br /><br />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import LogOut from "@/components/LogOut.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, getFirestore } from "firebase/firestore";
import firebaseApp from "../firebase.js";

export default {
  name: "About",

  components: {
    NavBar,
    LogOut,
  },

  data() {
    return {
      user: false,
      mmyy: "",
      pieData: {},
      colData: {},
    };
  },

  methods: {
    getMonthYear() {
      const currDateTime = new Date();
      return currDateTime.toLocaleString("default", {
        month: "long",
        year: "2-digit",
      });
    },

    async setPieData(email) {
      const db = getFirestore(firebaseApp);
      const monthYear = this.getMonthYear();
      const pie = {};
      const currMonthEntries = await getDocs(
        collection(db, email, "logs", monthYear)
      );
      this.pieData = {};
      currMonthEntries.forEach((doc) => {
        if (doc.data().category in pie) {
          pie[doc.data().category] += parseInt(doc.data().amount);
        } else {
          pie[doc.data().category] = parseInt(doc.data().amount);
        }
      });
      this.pieData = pie;
    },

    async setColData(email) {
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
      const db = getFirestore(firebaseApp);
      const allMonthEntries = doc(db, email, "logs");
      const currDateTime = new Date();
      const col = {};
      var monthIter = "";
      var monthTotal = 0;
      var hasEntries = false;

      for (
        let i = currDateTime.getMonth() + 1;
        i < currDateTime.getMonth() + 13;
        i++
      ) {
        monthTotal = 0;
        hasEntries = false;
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
        const monthData = await getDocs(collection(allMonthEntries, monthIter));
        monthData.forEach((doc) => {
          hasEntries = true;
          monthTotal += parseInt(doc.data().amount);
        });
        col[monthIter] = monthTotal;
      }
      this.colData = col;
    },
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.mmyy = this.getMonthYear();
        this.setPieData(user.email);
        this.setColData(user.email);
      }
    });
  },
};
</script>

<style scoped>
.about {
  text-align: left;
  border: 2px solid black;
  box-shadow: 3px 3px grey;
}

#graph-container {
  display: flex;
  flex-direction: row;
}

#pie-container {
  width: 50%;
}

#bar-container {
  width: 50%;
}
</style>
