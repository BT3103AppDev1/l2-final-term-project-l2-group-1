<template>
  <div id ="background-container">
    <div class="header-container">
                <h1 class="header-text">FinWise</h1>
                <img class="logo" src="@/assets/Logo.jpg">
    </div>
    <div style="text-align:center;" v-if="user">
      <div class="Parallax"></div>
        <div class="NavBarComp"><NavBar/></div>
        <div class="WelcomeComp"><WelcomeCpp/></div>
        <div class="AddCoinComp"><AddCoin  @added="change" /></div>
        <div  class="TotalComp"><TotalAmount/></div>
      <!-- <ProfitDisplay :key="refreshComp" /> -->
    
     <LogOut/>
    </div>
  </div>
</template>

<script>

import { getAuth, onAuthStateChanged } from "firebase/auth";
import WelcomeCpp from '@/components/WelcomeCpp.vue'
import AddCoin from '@/components/AddCoin.vue'
import ProfitDisplay from '@/components/ProfitDisplay.vue'
import NavBar from '@/components/NavBar.vue'
import LogOut from '@/components/LogOut.vue'
import TotalAmount from '@/components/TotalAmount.vue'

export default {
  name: 'Home',
  components:{
    WelcomeCpp,
    AddCoin,
    ProfitDisplay,
    NavBar,
    LogOut,
    TotalAmount
  },

  data(){
    return{
      user:false,
      refreshComp:0
      }
    },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      this.user = user;
      })
  },
  
  methods:{

  change(){
     this.refreshComp += 1
    }
  }
}

</script>

<style scoped>
#background-container { 
  background-color: rgb(255, 255, 255);
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

/* .Parallax {
  display: grid;
  place-items: center;
  min-height: 2000px;
  position: relative;
}

.Parallax > * {
  grid-area: auto;
  animation: parallax linear;
  animation-timeline: scroll();
}

.WelcomeComp {
  z-index: 1;
  --parallax-speed: 0;
}

.AddCoinComp {
  z-index: 2;
  --parallax-speed: -20;
}

@keyframes parallax {
  to {
    transform: translateY(calc(var(--parallax-speed) * 100px));
  }
} */
</style>