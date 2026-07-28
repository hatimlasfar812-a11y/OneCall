import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// العناصر
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

// مراقبة تسجيل الدخول
onAuthStateChanged(auth, (user) => {
  
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  
  userName.textContent =
    user.displayName ||
    "User";
  
  userEmail.textContent =
    user.email ||
    user.phoneNumber ||
    "No information";
  
});

// Logout
logoutBtn.addEventListener("click", async () => {
  
  const ok = confirm("Are you sure you want to logout?");
  
  if (!ok) return;
  
  try {
    
    await signOut(auth);
    
    window.location.href = "index.html";
    
  } catch (error) {
    
    alert(error.message);
    
  }
  
});

// القائمة (مؤقتاً)
document.getElementById("myInfo").onclick = () => {
  window.location.href = "my-information.html";
};



document.getElementById("trackOrder").onclick = () => {
  alert("Coming Soon");
};



document.getElementById("support").onclick = () => {
  alert("Coming Soon");
};