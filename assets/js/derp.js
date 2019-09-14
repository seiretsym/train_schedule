// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyA-pXG9MTK1x5pBfW1RUqEDpgXlbrpy8dY",
authDomain: "trainschedule-bb548.firebaseapp.com",
databaseURL: "https://trainschedule-bb548.firebaseio.com",
projectId: "trainschedule-bb548",
storageBucket: "",
messagingSenderId: "491227092044",
appId: "1:491227092044:web:1ce1a7e095d1f077ee90e9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// create pointer to firebase database
var db = firebase.database();

// function to submit new train info to database
function submitTrain() {

}

// submit button click event listener
$(document).on("click", "#submitTrain", function() {
    // prevent page refresh
    event.preventDefault();

    // submit train input values
    submitTrain();
})