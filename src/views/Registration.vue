<template>
    <div class="container">
        <div class="logo-container">
            <div class="logo">
                <h1>FinWise</h1>
                <!-- include finwise logo url -->
            </div>
        </div>

        <div class="register-container">
            <div class="register-form">
                <h1 class="register-text">Register</h1>
                <p class="welcome-text">Join us, Please create your account</p>
                <form @submit.prevent="registerUser">
                    <div class="input-container">
                        <input type="email" v-model="email" placeholder="Email" required>
                        <i class='bx bx-envelope'></i>
                    </div>
                    <div class="input-container">
                        <input type="password" v-model="password" placeholder="Password" required>
                        <i class='bx bxs-lock-alt'></i>
                    </div>
                    <button type="submit" class="login-button">Register</button>
                    <p class="login-text">Already have an account? <router-link to="/" class="login-link">Login</router-link></p>
                </form> 
            </div>  
        </div>

        <div class="image-container">
            <!-- Replace with actual image URL if needed -->
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