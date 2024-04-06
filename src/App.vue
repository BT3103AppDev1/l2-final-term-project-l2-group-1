<template>
  <div v-if="isAuthenticated">
    <NavBar />
  </div>
  <router-view />
  <div v-if="isAuthenticated">
    <Logout />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Logout from '@/components/Logout.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'App',

  components: {
    NavBar,
    Logout
  },

  data() {
    return {
      user: null,
      isAuthenticated: false
    };
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      this.isAuthenticated = !!user;
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: block;
  width: 100%;
  background-color: white;
}

#nav {
  padding: 15px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active { 
  color: #42b983;
}
</style>