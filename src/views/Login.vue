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
                        <div class="input-wrapper">
                            <input type="email" v-model="email" @input="validateEmail"
                                :class="{ 'email-invalid': emailError, 'email-valid': emailValid && email }"
                                placeholder="Email" required>
                            <i class='bx bx-envelope'
                                :class="{ 'icon-invalid': emailError, 'icon-valid': emailValid && email }"></i>
                        </div>
                        <span class="email-error" v-if="emailError">{{ emailError }}</span>
                        <span class="email-success" v-if="emailValid && !emailError">Email address is valid!</span>
                    </div>
                    <div class="input-container">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password"
                            required>
                        <i class='bx bxs-lock-alt'></i>
                        <span @click="showHidePassword"><img class="password-eye"
                                :src="showPassword ? eyeOpenIcon : eyeCloseIcon"></span>
                    </div>
                    <a class="forgot-password" @click="forgotPassword">Forgot Password?</a>
                    <button type="submit" class="login-button">Login</button>
                    <button @click="loginWithGoogle" class="google-login">Sign in with Google</button>
                    <p class="signup-text">Don't have an account? <router-link to="/registration"
                            class="signup-link">Sign up</router-link></p>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import eyeClose from '@/assets/Eye-close.png';
import eyeOpen from '@/assets/Eye-open.png';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { query, getDocs, collection, where, getFirestore } from 'firebase/firestore';
import firebaseApp from '@/firebase.js';

export default {
    name: "Login",

    data() {
        return {
            email: '',
            password: '',
            // For email validation
            emailError: null,
            emailValid: false,
            // For password display
            showPassword: false,
            eyeCloseIcon: eyeClose,
            eyeOpenIcon: eyeOpen,
            auth: getAuth(firebaseApp),
            db: getFirestore(firebaseApp)
        }
    },

    methods: {
        validateEmail() {
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
            if (!this.email) {
                this.emailValid = false;
                this.emailError = null;
            } else if (emailRegex.test(this.email)) {
                this.emailValid = true;
                this.emailError = null;
            } else {
                this.emailValid = false;
                this.emailError = "Please enter a valid email address";
            }
        },

        showHidePassword() {
            this.showPassword = !this.showPassword;
        },

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
        },

        async forgotPassword() {
            try {
                await sendPasswordResetEmail(this.auth, this.email);
                alert("Password reset email sent! Please check your email!");
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
    width: 500px;
}

.image-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    grid-column: 2;
    grid-row: 2;
    padding-bottom: 40px;
    margin-top: -40px;
    margin-right: -10px;
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
    padding: 15px 0px;
    margin-top: -30px;
    margin-left: 20px;
}

.image-container,
.login-container {
    margin-bottom: 100px;
}

.login-text {
    margin-bottom: 30px;
}

.input-container {
    position: relative;
    margin: 10px 0;
}

.input-container i {
    position: absolute;
    left: 103px;
    top: 50%;
    transform: translateY(-50%);
    color: #908d8d;
}

.input-wrapper {
    position: relative;
}

input[type=email] {
    padding: 15px 15px 15px 35px;
}

input[type=password],
input[type=text] {
    padding: 15px 45px 15px 35px;
}

input[type=email],
input[type=password],
input[type=text] {
    width: 70%;
    margin: 0;
    border: 1px solid #ccc;
    box-sizing: border-box;
    position: relative;
    border-radius: 16px;
    outline: none;
}

input[type='email']:focus,
input[type='password']:focus,
input[type='text']:focus {
    border: 2px solid #8414EC;
    transform: scale(1.025);
}

input[type='email']:focus+i,
input[type='password']:focus+i,
input[type='text']:focus+i {
    color: #8414EC;
}

input[type='email']:focus+i,
input[type='text']:focus+i {
    color: #8414EC;
}

/* Email validation styles should override focus styles */
.email-invalid {
    border: 2px solid #ff3860 !important;
}

.icon-invalid {
    color: #ff3860 !important;
}

.email-valid {
    border: 2px solid #09c372 !important;
}

.icon-valid {
    color: #09c372 !important;
}

.email-error {
    display: block;
    color: red;
    font-size: 12px;
    margin-top: 4px;
    text-align: left;
    padding-left: 95px;
}

.email-success {
    display: block;
    color: #09c372;
    font-size: 12px;
    margin-top: 4px;
    text-align: left;
    padding-left: 95px;
}

.password-eye {
    position: absolute;
    right: 103px;
    top: 50%;
    transform: translateY(-50%);
    height: 13px;
    width: auto;
    cursor: pointer;
}

.forgot-password,
.signup-link {
    text-decoration: none;
    color: #4116b7;
}

.forgot-password:hover {
    text-decoration: underline;
}

.signup-link:hover {
    text-decoration: underline;
}

.forgot-password {
    display: block;
    text-align: right;
    margin: 10px 95px 10px 0px;
    font-size: 15px;
}

.login-button,
.google-login {
    width: 70%;
    padding: 15px;
    margin: 10px 0;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 16px;
    font-weight: bold;
}

button:hover {
    transform: scale(1.01);
}

.login-button {
    background-image: linear-gradient(to right, #8414EC, #740CCC, #4116b7);
}

.google-login {
    background-color: #DB4437;
}

.signup-text {
    text-align: center;
    margin-top: 10px;
}
</style>