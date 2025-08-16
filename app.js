// 🔥 Fixed Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCi1FrxDcZ_Yryiy0EDku8FIf_XlgJA6s0",
  authDomain: "kasi-vibe-socials-0372.firebaseapp.com",
  databaseURL: "https://kasi-vibe-socials-0372-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kasi-vibe-socials-0372",
  storageBucket: "kasi-vibe-socials-0372.appspot.com",
  messagingSenderId: "719373156492",
  appId: "1:719373156492:web:0e7b6c94363484960e7ba9"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// UI Elements
const authContainer = document.getElementById("auth-container");
const mainContainer = document.getElementById("main-container");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("toggle-password");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const authMsg = document.getElementById("auth-msg");
const logoutBtn = document.getElementById("logout-btn");

// Show/hide password
togglePasswordBtn.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePasswordBtn.textContent = type === "password" ? "Show" : "Hide";
});

// Signup
signupBtn.addEventListener("click", () => {
  auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
    .then(() => { authMsg.textContent = "Signed up!"; })
    .catch(err => authMsg.textContent = err.message);
});

// Login
loginBtn.addEventListener("click", () => {
  auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
    .then(() => {
      authContainer.classList.add("hidden");
      mainContainer.classList.remove("hidden");
    })
    .catch(err => authMsg.textContent = err.message);
});

// Persistent login
auth.onAuthStateChanged(user => {
  if(user){
    authContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
  } else {
    authContainer.classList.remove("hidden");
    mainContainer.classList.add("hidden");
  }
});

// Logout
logoutBtn.addEventListener("click", () => auth.signOut());