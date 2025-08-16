
const auth = firebase.auth();
const database = firebase.database();

const preLogin = document.getElementById('pre-login');
const postLogin = document.getElementById('post-login');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const signInBtn = document.getElementById('signInBtn');
const createAccountBtn = document.getElementById('createAccountBtn');
const logoutBtn = document.getElementById('logoutBtn');

togglePassword.addEventListener('click', () => {
  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
});

signInBtn.addEventListener('click', () => {
  auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
  .then(() => console.log('Signed in'))
  .catch(err => alert(err.message));
});

createAccountBtn.addEventListener('click', () => {
  auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
  .then(() => console.log('Account created'))
  .catch(err => alert(err.message));
});

logoutBtn.addEventListener('click', () => {
  auth.signOut();
});

auth.onAuthStateChanged(user => {
  if(user) {
    preLogin.style.display = 'none';
    postLogin.style.display = 'block';
  } else {
    preLogin.style.display = 'block';
    postLogin.style.display = 'none';
  }
});
