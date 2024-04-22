<template>

<div class="header-container">
  <h1 class="header-text">FinWise</h1>
  <img class="logo" src="@/assets/Logo.jpg">
</div>

<div style="text-align:center;" v-if="user">

  <NavBar/>
  <!-- <h3>This is the logbook page!</h3> -->
  <ProfitDisplay/>
  <LogOut/>

</div>
</template>

<script>
import ProfitDisplay from '@/components/ProfitDisplay.vue'
import NavBar from '@/components/NavBar.vue'
import LogOut from '@/components/LogOut.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: 'OnlyProfit',

  components:{
    ProfitDisplay,
    NavBar,
    LogOut
  },

  data() {
    return {
      user:false,        
        }
    },

    mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
    if (user) {
      this.user = user;      
      }
  })
    },


  }

</script>

<style>
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
</style>



