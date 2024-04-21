<template>
<button id = "btn" @click="signOut()" v-if="user"> Logout </button>
    
</template>

<script>

// import firebaseApp from '@/firebase.js'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


export default {
  name: 'Logout',

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

  methods: {
    signOut() {
      const auth = getAuth();      
      const user = auth.currentUser;  
      signOut(auth, user)
      this.$router.push({name:'Login'}) 
                      
    }
  }
}

</script>

style <style scoped>
#btn{
  width: 40%;
  padding: 15px;
  margin: 10px 0;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 16px;
  font-weight: bold;
  background-color:#DB4437; 
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
#btn:hover{
    color:rgb(243, 236, 236);
    background-color:#bc382c;
    box-shadow: 3px 3px grey 
}

</style>