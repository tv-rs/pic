const addImageButton = document.getElementById("add-image-btn");
const imageUploadInput = document.getElementById("image-upload");
const collageContainer = document.getElementById("collage-container");
const body = document.querySelector("body");
var room_name = "tanRi";
var ImgName, ImgUrl;
var files = [];
var reader = new FileReader();
var savedUsername;
const loader = document.getElementById("loader");
const firebaseConfig_cr = {
  apiKey: "AIzaSyAP1wMLqAIvMKo4oDEO_wOsRhAdNX9YxCs",
  authDomain: "unratedi-d0f88.firebaseapp.com",
  databaseURL: "https://unratedi-d0f88-default-rtdb.firebaseio.com",
  projectId: "unratedi-d0f88",
  storageBucket: "unratedi-d0f88.firebasestorage.app",
  messagingSenderId: "523479003146",
  appId: "1:523479003146:web:c7f2c90b5023178ba16ff3",
};

const firebaseApp_other = firebase.initializeApp(firebaseConfig_cr, "other");
savedUsername = person = "Ri";
var finalTime;
setInterval(() => {
  var dt = new Date();
  var hours = dt.getHours() % 12 || 12;
  var AmOrPm = dt.getHours() >= 12 ? "PM" : "AM";
  var minutes = dt.getMinutes().toString().padStart(2, "0");
  var day = dt.getDate().toString().padStart(2, "0");
  var month = (dt.getMonth() + 1).toString().padStart(2, "0");
  dateDisplay = `${day}/${month}`;
  var timeString = dateDisplay + "-" + hours + ":" + minutes + " " + AmOrPm;
  finalTime = timeString;
}, 1000);

const db = firebaseApp_other.database();
const userRef = db.ref(`users/user${person}`);
const otherUserRef = db.ref(`users/user${person === "tan" ? "Ri" : "tan"}`);
addImageButton.addEventListener("click", () => {
  imageUploadInput.click();
});
// HTML input should have `multiple`:
// <input type="file" id="image-upload" accept="image/*" multiple hidden>

function handleImageSelection(event) {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) return;

  files.forEach((file) => {
    const reader = new FileReader(); // NEW reader for each file
    reader.onload = function (e) {
      const imageDataUrl = e.target.result;

      // Push to images folder, then (when that's done) push to chat
      firebaseApp_other
        .database()
        .ref(room_name + "images")
        .push({
          imageDataUrl: imageDataUrl,
          time: finalTime,
        })
        .then(() => {
          // Now send to chat using the same imageDataUrl (no need to query DB)
          return firebaseApp_other.database().ref(room_name).push({
            name: savedUsername,
            message: imageDataUrl,
            time: finalTime,
            type: "image",
          });
        })
        .then(() => {
          console.log("Uploaded image and sent to chat.");
        })
        .catch((error) => {
          console.error("Error saving/sending image:", error);
        });
    };

    reader.readAsDataURL(file);
  });

  // optional: allow re-selecting the same files later
  event.target.value = "";
}
document
  .getElementById("image-upload")
  .addEventListener("change", handleImageSelection);

document.getElementById("add-image-btn").addEventListener("click", function () {
  document.getElementById("image-upload").click();
});
document
  .getElementById("image-upload")
  .addEventListener("change", handleImageSelection);

function saveImageToDatabase(imageDataUrl) {
  firebaseApp_other
    .database()
    .ref(room_name + "images")
    .push({
      imageDataUrl: imageDataUrl,
      time: finalTime,
    })
    .then(() => {
      console.log("Image data URL saved to the database successfully.");
    })
    .catch((error) => {
      console.error("Error saving image data URL to the database:", error);
    });
  retrieveImage();
}
createChat();

function retrieveImage() {
  console.log("Retrieving latest image...");

  var imagesRef = firebaseApp_other
    .database()
    .ref(room_name + "images")
    .orderByKey()
    .limitToLast(1);
  console.log("Entering 'images' folder in the database...");

  imagesRef
    .once("value")
    .then(function (snapshot) {
      console.log("Data retrieved from 'images' folder:");

      snapshot.forEach(function (childSnapshot) {
        var imageDataUrl = childSnapshot.val().imageDataUrl;
        if (imageDataUrl) {
          console.log("Sending latest image URL to chat room...");
          firebaseApp_other
            .database()
            .ref(room_name)
            .push({
              name: savedUsername,
              message: imageDataUrl,
              time: finalTime,
              type: "image",
            })
            .then(() => {
              console.log("Image URL sent to chat successfully.");
            })
            .catch((error) => {
              console.error("Error sending image URL to chat:", error);
            });
        } else {
          console.log("Latest image URL is undefined.");
        }
      });
    })
    .catch(function (error) {
      console.error("Error retrieving image:", error);
    });
}

function createChat() {
  var room_name1 = "tanRi";
  firebaseApp_other
    .database()
    .ref("/")
    .once("value")
    .then(function (snapshot) {
      if (snapshot.hasChild(room_name1)) {
        navigateToChat(room_name1);
      } else {
        firebaseApp_other
          .database()
          .ref("/")
          .child(room_name1)
          .update({
            purpose: "adding room name",
          })
          .then(() => {
            localStorage.setItem("room_name", room_name1);
            navigateToChat(room_name1);
            console.log("output");
          });
      }
    })
    .catch(function (error) {
      console.error("Error checking if chat room exists:", error);
    });
}

function navigateToChat(room_name1) {
  localStorage.setItem("room_name", room_name1);
  console.log(localStorage.getItem("room_name"));
  getData();
}

function getData() {
  console.log(savedUsername);
  firebaseApp_other
    .database()
    .ref(room_name)
    .on("value", function (snapshot) {
      collageContainer.innerHTML = "";
      snapshot.forEach(function (childSnapshot) {
        const childData = childSnapshot.val();
        const name_of_sender = childData.name;
        const time_get = childData.time;
        const message = childData.message;
        collageContainer.innerHTML += `
          <img id="${time_get}" src="${message}" alt="Image from ${name_of_sender}" onclick="openImage(this)">
        `;
        previousSender = name_of_sender;
      });
    });
}

function openImage(imgE) {
  document.getElementById("loaderpop").style.display = "flex";
  document.getElementById("close-image-btn").style.display = "flex";
  document.getElementById("popimg").src = imgE.src;
}

function close_img() {
  document.getElementById("loaderpop").style.display = "none";
  document.getElementById("close-image-btn").style.display = "none";
}
