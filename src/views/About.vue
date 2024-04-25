<template>
  <div class="header-container">
    <h1 class="header-text">FinWise</h1>
    <img class="logo" src="@/assets/Logo.jpg" />
  </div>
  <div class="main" style="text-align: center" v-if="user">
    <NavBar />

    <div class="Main">
      <!-- <h2 id="Header">FinWise</h2> -->
      <div class="Headers">
        <div id="mySpending">My spending for {{ mmyy }}.</div>
        <div id="past12Months">Spending over the past 12 Months</div>
      </div>
      <div id="graph-container">
        <div id="pie-container">
          <pie-chart
            class="user"
            :data="pieData"
            :round="0"
            suffix="%"
          ></pie-chart>
        </div>
        <div id="bar-container">
          <column-chart
            class="user"
            :data="colData"
            :round="2"
            :zeros="true"
            prefix="$"
          ></column-chart>
        </div>
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
      var tempSum = 0;
      const currMonthEntries = await getDocs(
        collection(db, email, "logs", monthYear)
      );
      this.pieData = {};
      currMonthEntries.forEach((doc) => {
        if (doc.data().category in pie) {
          pie[doc.data().category] += parseFloat(doc.data().amount);
        } else {
          pie[doc.data().category] = parseFloat(doc.data().amount);
        }
        tempSum += parseFloat(doc.data().amount);
      });

      for (const category in pie) {
        pie[category] = (pie[category] / tempSum) * 100;
      }
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
            (parseFloat(
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
          monthTotal += parseFloat(doc.data().amount);
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
#mySpending, #past12Months {
  width: 50%;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: 1000;
  color: #740ccc;
  font-size: 45px;
  text-shadow: 3px 3px rgb(205, 205, 205);
}

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

.header-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  grid-column: 1 / -1;
  grid-row: 1;
  width: 100%;
  text-align: left;
}

.header-text {
  display: inline-block;
  font-size: 20px;
  color: #4116b7;
  margin-top: 20px;
}

.logo {
  height: 35px;
  width: auto;
  margin-top: 10px;
  margin-left: 3px;
}

.Main {
  background-image: url("@/assets/AboutBackground.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
  min-height: 700px;
}

.Headers {
  display: flex;
  border: 10px;
}
</style>
