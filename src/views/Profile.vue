<template>
    <div style="text-align:center;" v-if="user">
        <NavBar/>
        <div><h3><strong> This is the profile page </strong></h3></div>
        <div v-if="user">
            <div>
                <img id="vs" src="@/assets/logo.png" style="width:75px; height:75px; border-radius:50%; border:4px solid #333" />
            </div>
            <div>
                <p> Name: <strong>{{user.displayName}}</strong><br>
                Email: <strong>{{user.email}}</strong><br>
                Uid: <strong>{{user.uid}}</strong><br>
                Provider: <strong>{{user.providerData[0].providerId}}</strong> </p>
            </div>
        </div>
        <LogOut/>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
    name: "Profile",

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

}
</script>

<style>
#vs {
    margin-top: 15px;
}
</style>