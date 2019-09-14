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
    // check if input values are empty
    if ($("#trainName").val() === "") {
        // let user know it can't be empty
        $("#lbl1").html("Train Name (This can't be empty!)");
    }
    else if ($("#trainDestination").val() === "") {
        // let user know it can't be empty
        $("#lbl2").html("Destination (This can't be empty!)");
    }
    else if ($("#firstTrainTime").val() === "") {
        // let user know it can't be empty
        $("#lbl3").html("First Train Time (HH:MM AM/PM) (This can't be empty!)");
    }
    else if ($("#trainFrequency").val() === "") {
        // let user know it can't be empty
        $("#lbl4").html("Frequency (in minutes) (This can't be empty!)");
    }
    else {
        // grab input values
        var trainName = $("#trainName").val().trim(),
            trainFrequency = $("#trainFrequency").val().trim(),
            firstTrainTime = $("#firstTrainTime").val().trim(),
            trainDestination = $("#trainDestination").val().trim();

        // store values into database
        db.ref().push({
        trainName: trainName,
        trainDestination: trainDestination,
        firstTrainTime: firstTrainTime,
        trainFrequency: trainFrequency
        });

        // clear input values
        $("#trainName").val("");
        $("#trainDestination").val("");
        $("#firstTrainTime").val("");
        $("#trainFrequency").val("");

        // reset labels to default
        $("#lbl1").html("Train Name");
        $("#lbl2").html("Destination");
        $("#lbl3").html("First Train Time (HH:MM AM/PM)");
        $("#lbl4").html("Frequency (in minutes)");
    }
}

// get the next train time based off start time, frequency, and current time
function getNextTrain(startTime, frequency, currentTime) {
    var nextTrainTime = startTime + frequency;
    if (nextTrainTime > currentTime) {
        return nextTrainTime;
    }
    // if next train time is now
    else if (nextTrainTime === currentTime) {
        return nextTrainTime;
    }

    return getNextTrain(nextTrainTime, frequency, currentTime);
}

// convert time from minutes to military
function convertTime(time) {
    var hour = Math.floor(time / 60),
        minutes = time % 60;
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return (hour + ":" + minutes);
}

// submit button click event listener
$(document).on("click", "#submitTrain", function() {
    // prevent page refresh
    event.preventDefault();

    // submit train input values
    submitTrain();
})

//// change this to push so it can store/get multiple trains
// event listener to check database for changes
db.ref().on("child_added", function(snapshot) {
    // store database values into variables
    var trainName = snapshot.val().trainName,
        trainDestination = snapshot.val().trainDestination,
        firstTrainTime = moment(snapshot.val().firstTrainTime, "HH:mm").format("HH:mm"),
        trainFrequency = parseInt(snapshot.val().trainFrequency);

    // get next train time

        // get current time
        var currentTime = moment().format("HH:mm"),

        // convert times to minutes
            fttInMinutes = moment.duration(firstTrainTime).as("minutes"),
            ctInMinutes = moment.duration(currentTime).as("minutes"),

        // get that time
            nextTrainTime = getNextTrain(fttInMinutes, trainFrequency, ctInMinutes),

        // get time until next train
            minutesAway = nextTrainTime - ctInMinutes;

        // convert nextTrainTime to AM:PM
        nextTrainTime = convertTime(nextTrainTime);
        nextTrainTime = moment(nextTrainTime, "HH:mm").format("h:mm a");

    // append data current train schedule

        // create table row
        var tr = $("<tr>"),

        // create table columns
            thName = $("<td>").append(trainName),
            thDestination = $("<td>").append(trainDestination),
            thFrequency = $("<td>").append(trainFrequency),
            thNextTrain = $("<td>").append(nextTrainTime);

        // if minutes away = 0 then do something funny
        if (minutesAway === 0) {
            var thMinutesAway = $("<td>").append("NOW! MOVE IT!")
        }
        // otherwise set it to the time
        else {
            var thMinutesAway = $("<td>").append(minutesAway);
        }

        // append columns to row
        tr.append(thName, thDestination, thFrequency, thNextTrain, thMinutesAway);

        // append row to table in index.html
        $("#currentSchedule").append(tr);
})