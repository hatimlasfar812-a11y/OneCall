import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const ordersContainer =
  document.getElementById("ordersContainer");

onAuthStateChanged(auth, async (user) => {
  
  if (!user) {
    
    location.href = "login.html";
    return;
    
  }
  
  const q = query(
    
    collection(db, "orders"),
    
    where("uid", "==", user.uid),
    
    orderBy("createdAt", "desc")
    
  );
  
  const snapshot = await getDocs(q);
  
  ordersContainer.innerHTML = "";
  
  if (snapshot.empty) {
    
    ordersContainer.innerHTML = `

<div class="empty">

<h2>No Orders Yet</h2>

<p>Your orders will appear here.</p>

</div>

`;
    
    return;
    
  }
  
  snapshot.forEach((doc) => {
    
    const order = doc.data();
    
    let statusClass = "pending";
    
    switch ((order.status || "").toLowerCase()) {
      
      case "preparing":
        statusClass = "preparing";
        break;
        
      case "on the way":
        statusClass = "onway";
        break;
        
      case "delivered":
        statusClass = "delivered";
        break;
        
      case "cancelled":
        statusClass = "cancelled";
        break;
        
    }
    
    const date = order.createdAt?.toDate ?
      order.createdAt.toDate().toLocaleString() :
      "";
    
    ordersContainer.innerHTML += `

<div
class="order-card"
data-id="${doc.id}">

<div class="order-top">

<div>

<div class="restaurant-name">

${order.restaurantName || "Restaurant"}

</div>

<div class="order-number">

${order.orderNumber || doc.id.slice(0,8).toUpperCase()}

</div>

</div>

<span class="status ${statusClass}">

${order.status || "Pending"}

</span>

</div>

<div class="price">

${order.total} DH

</div>

<div class="date">

${date}

</div>

<div class="view-btn">

<span>View Details</span>

<i class="fa-solid fa-chevron-right"></i>

</div>

</div>

`;
    
  });
  
  document.querySelectorAll(".order-card")
    .forEach(card => {
      
      card.onclick = () => {
        
        location.href =
          `order-details.html?id=${card.dataset.id}`;
        
      };
      
    });
  
});