<template>
    <img class="background" src="@/assets/Wave.png">
    
    <div class="container">
        <div class="header-container">
                <h1 class="header-text">FinWise</h1>
                <img class="logo" src="@/assets/Logo.jpg">
        </div>

        <!-- Might need to change the image in order to not make it so similar to the login page -->
        <div class="image-container">
            <img class="image" src="@/assets/Register.png">
        </div>

        <div class="register-container">
            <div class="register-form">
                <img class="profile" src="@/assets/Profile1.png">
                <h1 class="register-text">Register</h1>
                <p class="welcome-text">Join us, Please create your account</p>
                <form @submit.prevent="registerUser">
                    <div class="input-container">
                        <input type="email" v-model="email" placeholder="Email" required>
                        <i class='bx bx-envelope'></i>
                    </div>
                    <div class="input-container">
                        <input type="text" v-model="password" placeholder="Password" required>
                        <i class='bx bxs-lock-alt'></i>
                    </div>
                    <button type="submit" class="register-button">Register</button>
                    <p class="login-text">Already have an account? <router-link to="/" class="login-link">Login</router-link></p>
                </form> 
            </div>  
        </div>
    </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { query, doc, getDocs, setDoc, collection, where, getFirestore } from 'firebase/firestore';
import firebaseApp from '@/firebase.js';

export default {
    name:"Registration",

    data() {
        return {
            username: '',
            email: '',
            password: '',
            auth: getAuth(firebaseApp),
            db: getFirestore(firebaseApp)
        }
    },

    methods: {
        async registerUser() {
            // For checking password complexity
            if (!this.checkPassword(this.password)) {
                return alert("Password does not match required complexity");
            }

            try {                
                // Creates a new user 
                await createUserWithEmailAndPassword(this.auth, this.email, this.password);

                // Redirect users to the login page
                alert("Registration successful");
                this.$router.push('/');

            } catch (error) {
                // Let firebase check for duplicate email
                if (error.code === 'auth/email-already-in-use') {
                    alert("Email is already registered");
                } else {
                    console.error("Registration unsuccessful:", error);
                    alert(error.message);
                }
            }
        },

        checkPassword(password) {
            // Password should be at least 8 characters consisting of at least 1 capital letter and 1 special character
            const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z@$!%*?&]{8,}$/;
            return complexityRegex.test(password);
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
    margin-top: 10px;
}

.logo {
    height: 35px; 
    width: auto;
    margin-top: 10px;
    margin-left: 3px; 
}

.image {
    max-width: 500px;
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

/* .image-container {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50%;
    overflow: hidden;
}

.image-container img {
    width: 100%;
    height: auto;
} */

.profile {
    width: 150px;
}

.register-container { 
    grid-column: 1; 
    grid-row: 2;
	justify-content: flex-start;
	align-items: center;
	text-align: center;
    padding: 15px 0px;
    margin-top: -30px;
    margin-left: 20px;
}

.image-container, .register-container {
    margin-bottom: 100px;
}

.register-text {
    margin-bottom: 30px;
}

.welcome-text {
    margin-bottom: 30px;
    color: #333;
}

.input-container {
    position: relative;
    margin: 10px 0;
}

input[type=email], input[type=text] {
    width: 70% ; 
    padding: 15px 15px 15px 35px; 
    margin: 0; 
    border: 1px solid #ccc;
    box-sizing: border-box;
    position: relative;
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

input[type='email']:focus, input[type='text']:focus {
  border: 2px solid #8414EC; 
  transform: scale(1.025); 
}

input[type='email']:focus + i, input[type='text']:focus + i {
    color: #8414EC;
}

.register-button {
    width: 70%;
    padding: 15px;
    margin: 10px 0;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 16px;
    font-weight: bold;
    background-image: linear-gradient(to right, #8414EC, #740CCC, #4116b7); 
}

button:hover{
    transform: scale(1.01);
}

.login-text {
    margin-top: 10px;
}

.login-link {
    text-decoration: none;
    color: #4116b7;
}

.login-link:hover {
    text-decoration: underline;
}

</style>