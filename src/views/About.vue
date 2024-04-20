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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import firebaseApp from "../firebase.js";
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

const currDateTime = new Date();
const monthYear = currDateTime.toLocaleString("default", {
  month: "long",
  year: "2-digit",
});
const db = getFirestore(firebaseApp);
const currUserId = getAuth().currentUser.uid;

const currMonthEntries = await getDocs(
  collection(db, currUserId, "logs", monthYear)
);
const pie = {};
currMonthEntries.forEach((doc) => {
  if (doc.data().category in pie) {
    pie[doc.data().category] += parseInt(doc.data().amount);
  } else {
    pie[doc.data().category] = parseInt(doc.data().amount);
  }
});

const allMonthEntries = doc(db, currUserId, "logs");
const col = {};
var monthIter = "";
var monthTotal = 0;
var monthData;
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
      (parseInt(currDateTime.toLocaleString("default", { year: "2-digit" })) -
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

export default {
  name: "About",

  components: {
    NavBar,
    LogOut,
  },

  data() {
    return {
      user: false,
      mmyy: monthYear,
      pieData: pie,
      colData: col,
    };
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
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

