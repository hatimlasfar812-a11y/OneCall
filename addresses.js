import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const list = document.getElementById("addressesList");
const addBtn = document.getElementById("addAddressBtn");

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  
  if (!user) {
    location.href = "login.html";
    return;
  }
  
  currentUser = user;
  loadAddresses();
  
});

async function loadAddresses() {
  
  list.innerHTML = "";
  
  const q = query(
    collection(db, "users", currentUser.uid, "addresses")
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    
    list.innerHTML = `
      <p class="empty">
        No addresses yet.
      </p>
    `;
    
    return;
  }
  
  snapshot.forEach((address) => {
    
    const data = address.data();
    
    list.innerHTML += `

<div class="address-card">

<h3 class="address-title">

${data.title}

</h3>

<p class="address-text">

${data.address}

</p>

<div class="address-actions">

<button
class="delete-btn"
data-id="${address.id}">

Delete

</button>

</div>

</div>

`;
    
  });
  
  document.querySelectorAll(".delete-btn").forEach(btn => {
    
    btn.onclick = async () => {
      
      if (!confirm("Delete this address?")) return;
      
      await deleteDoc(
        doc(
          db,
          "users",
          currentUser.uid,
          "addresses",
          btn.dataset.id
        )
      );
      
      loadAddresses();
      
    };
    
  });
  
}

addBtn.onclick = async () => {
  
  const title = prompt("Address name (Home, Work...)");
  
  if (!title) return;
  
  const address = prompt("Enter your address");
  
  if (!address) return;
  
  await addDoc(
    collection(db, "users", currentUser.uid, "addresses"),
    {
      title,
      address
    }
  );
  
  loadAddresses();
  
};