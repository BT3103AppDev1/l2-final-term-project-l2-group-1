<template>

<div class="header-container">
  <h1 class="header-text">FinWise</h1>
  <img class="logo" src="@/assets/Logo.jpg">
</div>
<div style="text-align:center;" v-if="user">

<NavBar/>    

<!-- <div > <h3><strong> This is the profile page </strong> </h3> </div>  -->

        <div class="ProfileMain" v-if="user">
        <div class="photo"> 
        <!-- <img src="@/assets/logo.png" style="width:75px;height:75px;border-radius:50%;border:4px solid #333" /> -->
        <img id="profilePhoto"  src="@/assets/Profile.png" />                                            
        </div>

        <div>
            <div class="profileDetails">
            <h2 class="name"> <strong>{{user.displayName}}</strong></h2><br/>
            <p class="email"> Email:</p>
            <p class="emailDetail"> <strong>{{user.email}}</strong></p> <br>
            <p class="uid"> Uid: </p>
            <p class="uidDetail"> <strong>{{user.uid}}</strong></p><br>
            <p class="provider"> Provider: </p> 
            <p class="providerDetail">  <strong>{{user.providerData[0].providerId}}</strong></p>
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
.photo {
  height: 200px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

#profilePhoto {
  width:100px;
  height:100px;
  border-radius:50%; 
  outline: 3px  solid black; 
  background-color: white;
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

.profileDetails {
  max-width: 300px;
  margin: 20px auto;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  padding: 20px;
  box-shadow: 5px 5px rgb(202, 201, 201);
  /* text-align: center; */
}

.name {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.email, .provider, .uid{
  font-size: 15px;
  text-align: left
}

.emailDetail, .uidDetail, .providerDetail{
  text-align: left;
}

.ProfileMain {
  background-image:url("@/assets/AboutBackground.png");
  height: 700px;
}
</style>