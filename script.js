// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
// UI Elements
const authContainer = document.getElementById("auth-container");
const mainContainer = document.getElementById("main-container");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const authMsg = document.getElementById("auth-msg");
const logoutBtn = document.getElementById("logout-btn");
// Profile
const profilePic = document.getElementById("profile-pic");
const displayNameInput = document.getElementById("display-name");
const bioInput = document.getElementById("bio");
const updateProfileBtn = document.getElementById("update-profile-btn");
// Feed
const postText = document.getElementById("post-text");
const postMedia = document.getElementById("post-media");
const postBtn = document.getElementById("post-btn");
const feedDiv = document.getElementById("feed");
// Chat
const chatList = document.getElementById("chat-list");
const chatInput = document.getElementById("chat-input");
const sendChatBtn = document.getElementById("send-chat-btn");
// Notifications
const notificationsList = document.getElementById("notifications-list");
// --- AUTH ---
signupBtn.addEventListener("click", () => {
  auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
  .then(userCred => { authMsg.textContent = "Signed up!"; })
  .catch(err => authMsg.textContent = err.message);
});
loginBtn.addEventListener("click", () => {
  auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
  .then(userCred => {
    authContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
    loadProfile();
    loadFeed();
    loadChat();
    loadStories();
  }).catch(err => authMsg.textContent = err.message);
});
logoutBtn.addEventListener("click", () => { auth.signOut().then(() => location.reload()); });
// --- PROFILE ---
updateProfileBtn.addEventListener("click", () => {
  const user = auth.currentUser;
  if (!user) return;
  db.collection('users').doc(user.uid).set({
    displayName: displayNameInput.value,
    bio: bioInput.value
  }, { merge: true });
});
function loadProfile() {
  const user = auth.currentUser;
  if (!user) return;
  db.collection('users').doc(user.uid).get().then(doc => {
    if(doc.exists){
      displayNameInput.value = doc.data().displayName || '';
      bioInput.value = doc.data().bio || '';
      if(doc.data().photoURL) profilePic.src = doc.data().photoURL;
    }
  });
}
// --- FEED ---
postBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;
  let mediaURL = "";
  if (postMedia.files[0]) {
    const fileRef = storage.ref().child(`posts/${user.uid}/${Date.now()}_${postMedia.files[0].name}`);
    await fileRef.put(postMedia.files[0]);
    mediaURL = await fileRef.getDownloadURL();
  }
  db.collection("posts").add({
    uid: user.uid,
    text: postText.value,
    media: mediaURL,
    timestamp: Date.now()
  });
  postText.value=""; postMedia.value="";
});
function loadFeed() {
  db.collection("posts").orderBy("timestamp","desc").onSnapshot(snapshot=>{
    feedDiv.innerHTML='';
    snapshot.forEach(doc=>{
      const data=doc.data();
      const postEl=document.createElement("div");
      postEl.classList.add("post");
      postEl.innerHTML=`<p>${data.text}</p>${data.media?`<img src="${data.media}" class="media">`:''}`;
      feedDiv.appendChild(postEl);
    });
  });
}
// --- CHAT ---
sendChatBtn.addEventListener("click",()=>{
  const user = auth.currentUser;
  if (!user) return;
  db.collection("chats").add({
    uid:user.uid,
    message:chatInput.value,
    timestamp:Date.now()
  });
  chatInput.value='';
});
function loadChat() {
  db.collection("chats").orderBy("timestamp").onSnapshot(snapshot=>{
    chatList.innerHTML='';
    snapshot.forEach(doc=>{
      const data=doc.data();
      const msgEl=document.createElement("div");
      msgEl.classList.add("chat-message");
      msgEl.textContent=`${data.message}`;
      chatList.appendChild(msgEl);
    });
  });
}
// --- NOTIFICATIONS ---
function notify(msg){
  const li=document.createElement("li");
  li.textContent=msg;
  li.classList.add("notification");
  notificationsList.appendChild(li);
}
// --- QUICKVIBES STORIES ---
function loadStories(){
  const storiesDiv=document.getElementById("stories");
  db.collection("stories").orderBy("timestamp","desc").onSnapshot(snapshot=>{
    storiesDiv.innerHTML='';
    snapshot.forEach(doc=>{
      const data=doc.data();
      const storyEl=document.createElement("div");
      storyEl.classList.add("story");
      storyEl.innerHTML=`<p>${data.uid}: ${data.text}</p>`;
      storiesDiv.appendChild(storyEl);
    });
  });
}
// Example AI Feed Recommendation (simple)
function recommendFeed(){
  db.collection("posts").orderBy("timestamp","desc").limit(10).get().then(snapshot=>{
    snapshot.forEach(doc=>{
      const data=doc.data();
      if(data.text.includes("🔥")) notify("Hot vibe detected in feed!");
    });
  });
}
setInterval(recommendFeed,60000);