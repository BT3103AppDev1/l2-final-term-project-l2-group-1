<template>

<div class="header-container">
  <h1 class="header-text">FinWise</h1>
  <img class="logo" src="@/assets/Logo.jpg">
</div>
<div style="text-align:center;" v-if="user">

<NavBar/>    

<!-- <div > <h3><strong> This is the profile page </strong> </h3> </div>  -->

        <div v-if="user">
        <div > 
        <img src="@/assets/logo.png" style="width:75px;height:75px;border-radius:50%;border:4px solid #333" />                                                                                                                      
        </div>

        <div>
            <div >
            <p>                                                                                                                                                              Name: <strong>{{user.displayName}}</strong><br/>
                Email:<strong>{{user.email}}</strong><br>
                Uid:<strong>{{user.uid}}</strong> <br>
                Provider: <strong>{{user.providerData[0].providerId}}</strong> </p>
            </div>                                                                                                      
        </div>         

      </div> 

<LogOut/>

</div>     


</template>

<script>

// import firebase from '../firebase.js';
import NavBar from '@/components/NavBar.vue'
import LogOut from '@/components/LogOut.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default {
  name: 'Profile',

  components:{
  NavBar,
  LogOut
    },

  data() {
      return {
          user: null,
      };
  },

  beforeCreate() {
      const auth = getAuth();
          onAuthStateChanged(auth, (user) => {
    if (user) {
      this.user = user;      
      }
  })
    
    //   firebase.auth().onAuthStateChanged(user => {
    //       this.user = user;
    //       // console.log("from profile.VUE", user)
    //   });
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