import { auth, db } from "./firebase.js";

import { getCart, clearCart } from "./cart.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const orderItems = document.getElementById("orderItems");
const subtotal = document.getElementById("subtotal");
const totalPrice = document.getElementById("totalPrice");
const deliveryAddress = document.getElementById("deliveryAddress");
const placeOrder = document.getElementById("placeOrder");
const changeAddress = document.getElementById("changeAddress");
const backBtn = document.getElementById("backBtn");

backBtn.onclick = () => history.back();

changeAddress.onclick = () => {
  location.href = "map.html";
};

const DELIVERY_FEE = 12;
const SERVICE_FEE = 2;

const cart = getCart();

let subtotalValue = 0;

deliveryAddress.textContent =
  localStorage.getItem("selectedAddress") ||
  "Choose your address";

cart.forEach(item => {
  
  subtotalValue += item.price * item.quantity;
  
  orderItems.innerHTML += `

<div class="order-item">

<div>

<div class="order-name">

${item.quantity} × ${item.name}

</div>

</div>

<div class="order-price">

${(item.price*item.quantity).toFixed(2)} DH

</div>

</div>

`;
  
});

subtotal.textContent = subtotalValue.toFixed(2) + " DH";

const total = subtotalValue + DELIVERY_FEE + SERVICE_FEE;

totalPrice.textContent = total.toFixed(2) + " DH";

let currentUser = null;

onAuthStateChanged(auth, user => {
  
  currentUser = user;
  
});

placeOrder.onclick = async () => {
  
  if (!currentUser) {
    
    alert("Please login first");
    
    return;
    
  }
  
  if (cart.length === 0) {
    
    alert("Your cart is empty");
    
    return;
    
  }
  
  if (!localStorage.getItem("selectedAddress")) {
    
    alert("Choose your address");
    
    return;
    
  }
  
  placeOrder.disabled = true;
  
  placeOrder.textContent = "Placing Order...";
  
  try {
    
   const docRef = await addDoc(collection(db, "orders"), {
      
      uid: currentUser.uid,
      
      items: cart,
      
      subtotal: subtotalValue,
      
      deliveryFee: DELIVERY_FEE,
      
      serviceFee: SERVICE_FEE,
      
      total: total,
      
      paymentMethod: "Cash",
      
      status: "Pending",
      
      address: localStorage.getItem("selectedAddress"),
      
      latitude: localStorage.getItem("latitude"),
      
      longitude: localStorage.getItem("longitude"),
      
      building: localStorage.getItem("building") || "",
      
      floor: localStorage.getItem("floor") || "",
      
      note: document.getElementById("orderNote").value,
      
      createdAt: serverTimestamp()
      
    });
    
    
  clearCart();

localStorage.setItem(
  "lastOrderId",
  docRef.id
);

location.href =
  "order-success.html";
    
  } catch (err) {
    
    console.error(err);
    
    alert(err.message);
    
    placeOrder.disabled = false;
    
    placeOrder.textContent = "Place Order";
    
  }
  
};