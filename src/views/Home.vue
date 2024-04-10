<template>
  <div style="text-align:center;" v-if="user">
    <NavBar/>
    <WelcomeCpp/>
    <AddCoin  @added="change" />
    <TotalAmount/>
    <!-- <ProfitDisplay :key="refreshComp" /> -->
    
    <LogOut/>
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
#bg { 
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 60%;
}
</style>