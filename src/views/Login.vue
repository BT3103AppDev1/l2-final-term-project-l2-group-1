<template>
    <img class="background" src="@/assets/Wave.png">

    <div class="container">
        <div class="header-container">
                <h1 class="header-text">FinWise</h1>
                <img class="logo" src="@/assets/Logo.jpg">
        </div>

        <div class="image-container">
            <img class="image" src="@/assets/Login.png">
        </div>

        <div class="login-container">
            <div class="login-form">
                <img class="profile" src="@/assets/Profile.png">
                <h1 class="login-text">Login</h1>
                <form @submit.prevent="loginWithEmail">
                    <div class="input-container">
                        <input type="email" v-model="email" placeholder="Email" required>
                        <i class='bx bx-envelope'></i>
                    </div>
                    <div class="input-container">
                        <input type="password" v-model="password" placeholder="Password" required>
                        <i class='bx bxs-lock-alt'></i>
                    </div>
                        <!-- Router link to forgot password page -->
                        <a class="forgot-password" href="#">Forgot Password?</a> 
                    <button type="submit" class="login-button">Login</button>
                    <button @click="loginWithGoogle" class="google-login">Sign in with Google</button>
                    <p class="signup-text">Don't have an account? <router-link to="/registration" class="signup-link">Sign up</router-link></p>
                </form> 
            </div>  
        </div>
    </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { query, getDocs, collection, where, getFirestore } from 'firebase/firestore';
import firebaseApp from '@/firebase.js';

export default {
    name:"Login",

    data() {
        return {
            username: '',
            password: '',
            auth: getAuth(firebaseApp),
            db: getFirestore(firebaseApp)
        }
    },

    methods: {
    async loginWithEmail() {
      try {
        // Logss in a user with email and password
        await signInWithEmailAndPassword(this.auth, this.email, this.password);

        // Redirects users to the home page
        this.$router.push('/home');

      } catch (error) {
        alert("Incorrect email / password");
      }
    },

    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        // Displays a popup window for google account login
        const result = await signInWithPopup(this.auth, provider);

        // Redirects users to the home page
        this.$router.push('/home');

      } catch (error) {
        alert(error.message);
      }
    }
  }
};
</script>

<style scoped>

* {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}

.background {
    position: fixed;
	bottom: 0;
	right: 0;
	height: 100%;
	z-index: -1;
}

.container {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 5rem;
    padding: 0 4rem;
}

.header-container {
    display: flex; /* Use flexbox for easy vertical alignment */
    align-items: center; /* This will vertically align the children (logo and h1) in the middle */
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
    margin-top: 10px;
}

.logo {
    height: 35px; 
    width: auto;
    margin-top: 10px;
    margin-left: 3px; 
}

.image {
    width: 500px;
}

.image-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    grid-column: 2; 
    grid-row: 2;
    padding-bottom: 40px;
    margin-top: -16px;
    margin-right: -1px;
}

.profile {
    width: 150px;
}

.login-container { 
    grid-column: 1; 
    grid-row: 2;
	justify-content: flex-start;
	align-items: center;
	text-align: center;
    padding-right:0px;
    margin-top: -30px;
}

.image-container, .login-container {
    margin-bottom: 100px;
}


.login-text {
    margin-bottom: 30px;
}

.welcome-text {
    text-align: center;
    padding-bottom: 10px;
}

.input-container {
  position: relative;
  margin: 10px 0;
}

input[type=email], input[type=password] {
  width: 70% ; 
  padding: 15px 15px 15px 35px; 
  margin: 0; 
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 16px;
  outline: none;
}

.input-container i {
  position: absolute;  
  left: 103px; 
  top: 50%;
  transform: translateY(-50%);
  color: #908d8d; 
}

input[type='email']:focus, input[type='password']:focus {
  border: 2px solid #8414EC; /* Change the border color */
  transform: scale(1.05); /* Scale the input field */
}

.forgot-password, .signup-link {
  text-decoration: none;
  color: #4116b7; 
}

.forgot-password {
  display: block;
  text-align: right;
  margin: 10px 95px 10px 0px;
  font-size: 15px; 
}

.login-button, .google-login {
  width: 70%;
  padding: 15px;
  margin: 10px 0;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 16px;
  font-weight: bold;

}

button:hover{
	background-position: left;
    transform: scale(1.01);
}

.login-button{
    background-image: linear-gradient(to right, #8414EC, #740CCC, #4116b7); 
}

.google-login {
    background-color: #DB4437; /* Google button color */
}

.signup-text {
    text-align: center;
    margin-top: 5px;
}

</style>