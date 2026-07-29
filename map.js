const map = L.map("map", {
  zoomControl: false
}).setView([34.6814, -1.9086], 15);

L.control.zoom({
  position: "bottomright"
}).addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

const address = document.getElementById("selectedAddress");
const gpsBtn = document.getElementById("gpsBtn");
const confirmBtn = document.getElementById("confirmBtn");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const backBtn = document.getElementById("backBtn");

let marker = null;

// رجوع
backBtn.onclick = () => history.back();

// إنشاء Marker
function createMarker(lat, lng) {
  
  if (marker) {
    map.removeLayer(marker);
  }
  
  marker = L.marker([lat, lng], {
    draggable: true
  }).addTo(map);
  
  map.setView([lat, lng], 17);
  
  updateAddress(lat, lng);
  
  marker.on("dragend", () => {
    
    const pos = marker.getLatLng();
    
    updateAddress(pos.lat, pos.lng);
    
  });
  
}

// استخراج العنوان
async function updateAddress(lat, lng) {
  
  try {
    
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    
    const data = await res.json();
    
    const place = data.display_name || "Unknown location";
    
    address.textContent = place;
    
    localStorage.setItem("selectedAddress", place);
    localStorage.setItem("latitude", lat);
    localStorage.setItem("longitude", lng);
    
  } catch {
    
    address.textContent = "Unable to load address";
    
  }
  
}

// GPS
gpsBtn.onclick = () => {
  
  navigator.geolocation.getCurrentPosition(
    
    pos => {
      
      createMarker(
        pos.coords.latitude,
        pos.coords.longitude
      );
      
    },
    
    () => {
      
      alert("Please enable location.");
      
    }
    
  );
  
};

// أول تشغيل
gpsBtn.click();

// البحث
searchInput.addEventListener("input", async () => {
  
  const text = searchInput.value.trim();
  
  if (text.length < 3) {
    
    searchResults.style.display = "none";
    
    return;
    
  }
  
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}`
  );
  
  const data = await res.json();
  
  searchResults.innerHTML = "";
  
  searchResults.style.display = "block";
  
  data.slice(0, 5).forEach(item => {
    
    searchResults.innerHTML += `
        <div
        class="result-item"
        data-lat="${item.lat}"
        data-lon="${item.lon}">
        ${item.display_name}
        </div>
        `;
    
  });
  
});

// اختيار نتيجة البحث
searchResults.addEventListener("click", e => {
  
  const item = e.target.closest(".result-item");
  
  if (!item) return;
  
  createMarker(
    
    Number(item.dataset.lat),
    
    Number(item.dataset.lon)
    
  );
  
  searchInput.value = item.textContent;
  
  searchResults.style.display = "none";
  
});

// تأكيد العنوان
confirmBtn.onclick = () => {
  
  localStorage.setItem(
    "building",
    document.getElementById("building").value
  );
  
  localStorage.setItem(
    "floor",
    document.getElementById("floor").value
  );
  
  localStorage.setItem(
    "note",
    document.getElementById("note").value
  );
  
  window.location.href = "checkout.html";
  
};

// الضغط على الخريطة
map.on("click", e => {
  
  createMarker(
    
    e.latlng.lat,
    
    e.latlng.lng
    
  );
  
});
const sheet = document.querySelector(".bottom-sheet");
const handle = document.querySelector(".sheet-handle");

let expanded = false;

function toggleSheet() {
  expanded = !expanded;
  
  if (expanded) {
    sheet.classList.add("expanded");
  } else {
    sheet.classList.remove("expanded");
  }
}

handle.addEventListener("click", toggleSheet);

// Swipe
let startY = 0;

sheet.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
});

sheet.addEventListener("touchend", e => {
  
  const endY = e.changedTouches[0].clientY;
  
  if (startY - endY > 50) {
    sheet.classList.add("expanded");
    expanded = true;
  }
  
  if (endY - startY > 50) {
    sheet.classList.remove("expanded");
    expanded = false;
  }
  
});
