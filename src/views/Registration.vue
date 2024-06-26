<template>
    <img class="background" src="@/assets/Wave.png">
    
    <div class="container">
        <div class="header-container">
                <h1 class="header-text">FinWise</h1>
                <img class="logo" src="@/assets/Logo.jpg">
        </div>

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
                        <div class="input-wrapper">
                            <input type="email" v-model="email" @input="validateEmail" :class="{'email-invalid': emailError, 'email-valid': emailValid && email}" placeholder="Email" required>
                            <i class='bx bx-envelope' :class="{'icon-invalid': emailError, 'icon-valid': emailValid && email}"></i>
                        </div>
                        <span class="email-error" v-if="emailError">{{ emailError }}</span>
                        <span class="email-success" v-if="emailValid && !emailError">Valid email format! (We will check if your email is already registered after you click the "Register" button!) </span>
                    </div>
                    <div class="input-container" :class="{ 'input-wrapper-focused': passwordFocused }">
                        <div class="input-wrapper">
                            <input type="text" v-model="password" placeholder="Password" @focus="focusPassword" @blur="blurPassword" required :class="{'password-invalid': !passwordValid && passwordFilled, 'password-valid': passwordValid}">
                            <i class='bx bxs-lock-alt' :class="{'icon-invalid': !passwordValid && passwordFilled, 'icon-valid': passwordValid}"></i>
                        </div>
                        <span class="password-error" v-if="!passwordValid && passwordFilled && !passwordFocused">Password does not match required complexity</span>
                        <span class="password-success" v-if="passwordValid && passwordFilled && !passwordFocused">Password is valid!</span>
                        <div class="password-checklist">
                            <p>Password complexity</p>
                            <ul>
                                <li :class="getClassForCondition('minCharacter')"><span>At least 8 characters</span></li>
                                <li :class="getClassForCondition('number')"><span>At least 1 number</span></li>
                                <li :class="getClassForCondition('uppercase')"><span>At least 1 uppercase character</span></li>
                                <li :class="getClassForCondition('specialChar')"><span>At least 1 special character</span></li>
                            </ul>
                        </div>
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
            // For email validation
            emailError: null, 
            emailValid: false, 
            password: '',
            // For password validation
            passwordFocused: false, 
            passwordFilled: false,
            passwordConditions: {
                minCharacter: false,
                number: false,
                uppercase: false,
                specialChar: false
            },
            passwordValid: false,
            auth: getAuth(firebaseApp),
            db: getFirestore(firebaseApp)
        }
    },

    methods: {
        async registerUser() {
            if (!this.emailValid) {
                alert("Please enter a valid email address");
                return;
            }

            if (!this.passwordValid) {
                alert("Password does not match required complexity");
                return;
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
                    this.emailError = "Email is already registered";
                    this.emailValid = false;
                } else {
                    console.error("Registration unsuccessful:", error);
                    alert(error.message);
                }
            }
        },

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

        // Validate password for error alert
        checkPassword(password) {
            // Password should be at least 8 characters consisting of at least 1 number, 1 capital letter and 1 special character
            const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return complexityRegex.test(password);
        },

        // To handle case where user clicks in the password input field
        focusPassword() {
            this.passwordFocused = true;
        },

        // To handle case where user clicks out of the password input field
        blurPassword() {
            this.passwordFocused = false;
            this.passwordFilled = this.password.trim() !== ''; // If password field is not empty, we set state as filed
        },

        // Check updated password conditions and change display
        getClassForCondition(condition) {
            return {
                'valid-condition': this.passwordConditions[condition],
                'bx': true,
                'bx-check': this.passwordConditions[condition],
                'bx-x': !this.passwordConditions[condition]
            }
        },

        // Checks if all the password conditions are met
        checkAllConditionsMet() {
            return this.passwordConditions.minCharacter &&
                this.passwordConditions.number &&
                this.passwordConditions.uppercase &&
                this.passwordConditions.specialChar;
        },
    },

    // Check and update password conditions
    watch: {
        password(input) {
            this.passwordConditions.minCharacter = input.length >= 8;
            this.passwordConditions.number = /[0-9]/.test(input);
            this.passwordConditions.uppercase = /[A-Z]/.test(input);
            this.passwordConditions.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(input);
            this.passwordValid = this.checkAllConditionsMet();
            this.passwordFilled = input.trim() !== '';
        }
    },
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
    margin-bottom: 25px;
    color: #333;
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

input[type=email], input[type=text] {
    width: 70%; 
    padding: 15px 15px 15px 35px; 
    margin: 0; 
    border: 1px solid #ccc;
    box-sizing: border-box;
    position: relative;
    border-radius: 16px;
    outline: none;
}

input[type='email']:focus, input[type='text']:focus {
    border: 2px solid #8414EC; 
    transform: scale(1.025); 
}

input[type='email']:focus + i, input[type='text']:focus + i {
    color: #8414EC;
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
    max-width: calc(100% - 90px);
    word-wrap: break-word;
    line-height: 1.5;
}

.password-checklist {
    position: absolute;
    font-size: 14px;
    padding: 20px 15px;
    margin: 30px 0px -35px 89px;
    top: 10px;
    text-align: left;
    width: 70%; 
}

.password-checklist p {
    margin-bottom: 5px;
    margin-left: 3px;
    font-weight: bold;
}

.password-checklist ul {
    list-style: none;
    padding: 0px;
}

.password-checklist li {
    display: block;
    color: #ff3860;  
    position: relative; 
    line-height: 1.5;
}

.password-checklist li::before {
    font-weight: bold;
    display: inline-block; 
    width: 16px;
    transform: translateY(8%); 
}

/* For showing and hiding password checklist */
.input-wrapper-focused .password-checklist {
    display: block;
}

.password-checklist {
    display: none;
}

.input-wrapper-focused ~ .register-button,
.input-wrapper-focused ~ .login-text {
    transform: translateY(90px); 
    transition: transform 0.25s ease-in-out;
}

.password-checklist li.valid-condition {
    color: #09c372; 
}

.password-error {
    display: block;
    color: #ff3860; 
    font-size: 12px;
    margin-top: 4px;
    text-align: left;
    padding-left: 95px;
}

.password-success {
    display: block;
    color: #09c372;
    font-size: 12px;
    margin-top: 4px;
    text-align: left;
    padding-left: 95px;
}

/* Email and password validation styles should override focus styles */
.email-invalid, .password-invalid {
    border: 2px solid #ff3860 !important; 
}

.icon-invalid {
    color: #ff3860 !important; 
} 

.email-valid, .password-valid {
    border: 2px solid #09c372 !important;
}

.icon-valid {
    color: #09c372 !important; 
} 

.register-button {
    width: 70%;
    padding: 15px;
    margin: 30px 0px 10px 0px; 
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