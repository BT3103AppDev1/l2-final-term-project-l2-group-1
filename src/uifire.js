import firebase from 'firebase/compat/app';

const firebaseConfig = {
    apiKey: "AIzaSyATO5WL6DAesJ_g-QOwX3yKR6-4qrbmiUE",
    authDomain: "democpp-btjd.firebaseapp.com",
    projectId: "democpp-btjd",
    storageBucket: "democpp-btjd.appspot.com",
    messagingSenderId: "547516002956",
    appId: "1:547516002956:web:f9bd9f6f6a8990715701a9"
};

firebase.initializeApp(firebaseConfig);
console.log("fire is ", firebase)

export default firebase;