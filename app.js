// Application State
let restaurants = [];
let currentUser = null;
let currentSearchQuery = "";
let currentRestaurant = null;

// Active Filters State
let filters = {
  price8: false,
  price10: false,
  solo: false,
  group: false
};
let activeSort = "rating"; // 'rating' | 'price' | 'distance'

// DOM Elements
const authView = document.getElementById("authView");
const homeView = document.getElementById("homeView");
const resultsView = document.getElementById("resultsView");
const detailView = document.getElementById("detailView");

const navUserPanel = document.getElementById("navUserPanel");
const authForm = document.getElementById("authForm");
const registerFields = document.getElementById("registerFields");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const btnAuthSubmit = document.getElementById("btnAuthSubmit");
const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");

const homeSearchForm = document.getElementById("homeSearchForm");
const homeSearchInput = document.getElementById("homeSearchInput");
const resultsSearchForm = document.getElementById("resultsSearchForm");
const resultsSearchInput = document.getElementById("resultsSearchInput");
const resultsQueryText = document.getElementById("resultsQueryText");
const resultsCount = document.getElementById("resultsCount");
const restaurantsContainer = document.getElementById("restaurantsContainer");

// Filter buttons
const filterPrice8 = document.getElementById("filterPrice8");
const filterPrice10 = document.getElementById("filterPrice10");
const filterSolo = document.getElementById("filterSolo");
const filterGroup = document.getElementById("filterGroup");
const activeFiltersDisplay = document.getElementById("activeFiltersDisplay");

// Detail page elements
const detailHeroCard = document.getElementById("detailHeroCard");
const detailMenuList = document.getElementById("detailMenuList");
const detailRatingSummary = document.getElementById("detailRatingSummary");
const detailReviewsCount = document.getElementById("detailReviewsCount");
const detailReviewsFeed = document.getElementById("detailReviewsFeed");

const reviewSubmitForm = document.getElementById("reviewSubmitForm");
const reviewRating = document.getElementById("reviewRating");
const reviewText = document.getElementById("reviewText");
const btnSimulateReceipt = document.getElementById("btnSimulateReceipt");
const reviewReceiptStatus = document.getElementById("reviewReceiptStatus");
const receiptStatusDisplay = document.getElementById("receiptStatusDisplay");

// Init App on Load
document.addEventListener("DOMContentLoaded", () => {
  initDatabase();
  checkLoginState();
  setupEventListeners();
});

// Setup Initial Database in localStorage if empty
function initDatabase() {
  if (!localStorage.getItem("menuFinderRestaurants")) {
    localStorage.setItem("menuFinderRestaurants", JSON.stringify(INITIAL_RESTAURANTS));
  }
  restaurants = JSON.parse(localStorage.getItem("menuFinderRestaurants"));

  if (!localStorage.getItem("menuFinderAccounts")) {
    // Default account for testing
    const defaultAccounts = [
      { username: "test", password: "123", email: "test@korea.ac.kr", university: "고려대학교 안암캠퍼스" }
    ];
    localStorage.setItem("menuFinderAccounts", JSON.stringify(defaultAccounts));
  }
}

// Check if user is logged in
function checkLoginState() {
  currentUser = JSON.parse(localStorage.getItem("menuFinderUser"));
  updateNavUserPanel();

  if (currentUser) {
    showView("homeView");
  } else {
    showView("authView");
  }
}

// SPA Routing System
function showView(viewId) {
  // Hide all sections
  [authView, homeView, resultsView, detailView].forEach(section => {
    section.classList.add("hidden");
  });

  // Show selected section
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.remove("hidden");
  }
  window.scrollTo(0, 0);
}

// Update the user panel in the top navbar
function updateNavUserPanel() {
  if (currentUser) {
    navUserPanel.innerHTML = `
      <div class="user-welcome">
        👤 <strong>${escapeHtml(currentUser.username)}</strong> 학우님 
        <span class="univ-badge">${escapeHtml(currentUser.university.split(" ")[0])}</span>
      </div>
      <button class="btn btn-secondary" id="btnLogout" style="padding: 6px 12px; font-size: 0.8rem;">로그아웃</button>
    `;
    document.getElementById("btnLogout").addEventListener("click", handleLogout);
  } else {
    navUserPanel.innerHTML = `
      <span class="user-welcome">인증된 학우 전용 서비스</span>
    `;
  }
}

// Handle login tabs toggle
let isRegisterMode = false;
function setAuthMode(mode) {
  if (mode === "register") {
    isRegisterMode = true;
    authTitle.textContent = "학우 회원가입";
    authSubtitle.textContent = "대학교 메일 인증을 통해 신뢰 커뮤니티에 가입하세요!";
    registerFields.classList.remove("hidden");
    btnAuthSubmit.textContent = "가입하기";
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
  } else {
    isRegisterMode = false;
    authTitle.textContent = "학우 로그인";
    authSubtitle.textContent = "같은 대학 친구들이 인증한 진짜 맛집을 찾으세요!";
    registerFields.classList.add("hidden");
    btnAuthSubmit.textContent = "로그인";
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // Auth view toggles
  tabLogin.addEventListener("click", () => setAuthMode("login"));
  tabRegister.addEventListener("click", () => setAuthMode("register"));

  // Logo navigation
  document.getElementById("navLogo").addEventListener("click", () => {
    if (currentUser) showView("homeView");
  });

  // Auth Submit
  authForm.addEventListener("submit", handleAuthSubmit);

  // Search Submit (Home)
  homeSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = homeSearchInput.value.trim();
    if (query) triggerSearch(query);
  });

  // Search Submit (Results Header)
  resultsSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = resultsSearchInput.value.trim();
    if (query) triggerSearch(query);
  });

  // Quick keywords
  document.querySelectorAll(".quick-keyword-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const keyword = btn.textContent;
      homeSearchInput.value = keyword;
      triggerSearch(keyword);
    });
  });

  // Category cards
  document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      const cat = card.dataset.category;
      let keyword = "";
      if (cat === "한식") keyword = "김밥";
      else if (cat === "일식") keyword = "돈카츠";
      else if (cat === "양식") keyword = "스테이크";
      else keyword = "버거";
      triggerSearch(keyword);
    });
  });

  // Filter Buttons Toggles
  filterPrice8.addEventListener("click", () => toggleFilter("price8"));
  filterPrice10.addEventListener("click", () => toggleFilter("price10"));
  filterSolo.addEventListener("click", () => toggleFilter("solo"));
  filterGroup.addEventListener("click", () => toggleFilter("group"));

  // Sort buttons
  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeSort = btn.dataset.sort;
      renderSearchResults();
    });
  });

  // Navigation back buttons
  document.getElementById("btnBackToHome").addEventListener("click", () => showView("homeView"));
  document.getElementById("btnBackToResults").addEventListener("click", () => showView("resultsView"));

  // Review Receipt simulator
  btnSimulateReceipt.addEventListener("click", handleReceiptSimulation);

  // Submit Review Form
  reviewSubmitForm.addEventListener("submit", handleReviewSubmit);

  // Reset Data link
  document.getElementById("btnResetData").addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("모든 평점 및 추가된 리뷰를 초기화하고 초기 상태로 되돌리겠습니까?")) {
      localStorage.removeItem("menuFinderRestaurants");
      location.reload();
    }
  });
}

// Authentication Logic
function handleAuthSubmit(e) {
  e.preventDefault();
  const username = document.getElementById("authUsername").value.trim();
  const password = document.getElementById("authPassword").value;
  
  const accounts = JSON.parse(localStorage.getItem("menuFinderAccounts") || "[]");

  if (isRegisterMode) {
    const email = document.getElementById("authEmail").value.trim();
    const university = document.getElementById("authUniversity").value;
    
    // Check if ID exists
    const exists = accounts.some(acc => acc.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      alert("이미 존재하는 아이디입니다.");
      return;
    }

    const newAccount = { username, password, email, university };
    accounts.push(newAccount);
    localStorage.setItem("menuFinderAccounts", JSON.stringify(accounts));
    
    currentUser = newAccount;
    localStorage.setItem("menuFinderUser", JSON.stringify(currentUser));
    updateNavUserPanel();
    
    alert("회원가입이 완료되었습니다!");
    showView("homeView");
  } else {
    // Login
    const user = accounts.find(acc => acc.username === username && acc.password === password);
    if (user) {
      currentUser = user;
      localStorage.setItem("menuFinderUser", JSON.stringify(currentUser));
      updateNavUserPanel();
      showView("homeView");
    } else {
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  }
}

function handleLogout() {
  localStorage.removeItem("menuFinderUser");
  currentUser = null;
  updateNavUserPanel();
  showView("authView");
}

// Search Handler
function triggerSearch(query) {
  currentSearchQuery = query;
  resultsSearchInput.value = query;
  resultsQueryText.textContent = `"${query}"`;
  
  // Reset filters on new search
  filters = { price8: false, price10: false, solo: false, group: false };
  updateFilterButtonsUI();
  
  renderSearchResults();
  showView("resultsView");
}

// Filter triggers
function toggleFilter(filterKey) {
  // Mutually exclusive price filters
  if (filterKey === "price8") {
    filters.price8 = !filters.price8;
    if (filters.price8) filters.price10 = false;
  } else if (filterKey === "price10") {
    filters.price10 = !filters.price10;
    if (filters.price10) filters.price8 = false;
  } else {
    filters[filterKey] = !filters[filterKey];
  }

  updateFilterButtonsUI();
  renderSearchResults();
}

function updateFilterButtonsUI() {
  // Toggle CSS class active
  filterPrice8.classList.toggle("active", filters.price8);
  filterPrice10.classList.toggle("active", filters.price10);
  filterSolo.classList.toggle("active", filters.solo);
  filterGroup.classList.toggle("active", filters.group);

  // Render active filter pills
  let tagsHtml = "";
  if (filters.price8) tagsHtml += `<span class="active-filter-tag">💸 8천원이하 <span class="remove-btn" onclick="toggleFilter('price8')">&times;</span></span>`;
  if (filters.price10) tagsHtml += `<span class="active-filter-tag">💸 1만원이하 <span class="remove-btn" onclick="toggleFilter('price10')">&times;</span></span>`;
  if (filters.solo) tagsHtml += `<span class="active-filter-tag">🍱 혼밥대환영 <span class="remove-btn" onclick="toggleFilter('solo')">&times;</span></span>`;
  if (filters.group) tagsHtml += `<span class="active-filter-tag">👥 단체석/예약 <span class="remove-btn" onclick="toggleFilter('group')">&times;</span></span>`;

  activeFiltersDisplay.innerHTML = tagsHtml;
}

// Search Filters & Sort Calculations
function renderSearchResults() {
  const query = currentSearchQuery.trim().toLowerCase();

  // 1. Filter restaurants by query matching restaurant name, category, OR actual menus
  let matched = restaurants.map(res => {
    // Find matching menu item
    const matchedMenu = res.menus.find(m => m.name.toLowerCase().includes(query));
    
    // Check if name or category matches
    const nameMatch = res.name.toLowerCase().includes(query);
    const categoryMatch = res.category.toLowerCase().includes(query);
    const hasMatchedMenu = !!matchedMenu;

    if (nameMatch || categoryMatch || hasMatchedMenu) {
      // Pick matched menu or default to first menu
      const displayMenu = matchedMenu || res.menus[0];
      return {
        ...res,
        _displayMenu: displayMenu,
        _isMenuMatched: hasMatchedMenu
      };
    }
    return null;
  }).filter(r => r !== null);

  // 2. Apply side-bar filters
  if (filters.price8) {
    matched = matched.filter(res => res._displayMenu.price <= 8000);
  }
  if (filters.price10) {
    matched = matched.filter(res => res._displayMenu.price <= 10000);
  }
  if (filters.solo) {
    matched = matched.filter(res => res.isSoloFriendly);
  }
  if (filters.group) {
    matched = matched.filter(res => res.hasGroupSeats || res.canReserve);
  }

  // 3. Sort results
  matched.sort((a, b) => {
    if (activeSort === "rating") {
      return b.rating - a.rating; // high score first
    } else if (activeSort === "price") {
      return a._displayMenu.price - b._displayMenu.price; // low price first
    } else if (activeSort === "distance") {
      return a.distance - b.distance; // closest first
    }
    return 0;
  });

  // Update count
  resultsCount.textContent = matched.length;

  // 4. Render Grid HTML
  if (matched.length === 0) {
    restaurantsContainer.innerHTML = `
      <div class="no-results-state">
        <span class="no-results-emoji">😭</span>
        <h4>필터와 매칭되는 매장이 없습니다</h4>
        <p>조건을 완화하여 다시 검색해 보시겠어요?</p>
      </div>
    `;
    return;
  }

  restaurantsContainer.innerHTML = matched.map(res => {
    const tagsHtml = res.tags.map(t => `<span class="card-tag">${escapeHtml(t)}</span>`).join("");
    
    // Highlight matched menu item badge
    const matchedClass = res._isMenuMatched ? 'matched-menu-name' : 'matched-menu-name-default';
    const highlightLabel = res._isMenuMatched ? '매칭 메뉴' : '대표 메뉴';
    const ratingRounded = '★'.repeat(Math.round(res.rating)) + '☆'.repeat(5 - Math.round(res.rating));

    return `
      <div class="restaurant-card" onclick="viewRestaurantDetail('${res.id}')">
        <div class="card-header-row">
          <div class="card-title-block">
            <h4>${escapeHtml(res.name)}</h4>
            <span class="card-cat-badge">${escapeHtml(res.category)} &middot; ${escapeHtml(res.area)}</span>
          </div>
          <div class="card-rating-badge" title="인증 평점: ${res.rating}">
            ⭐ ${res.rating.toFixed(1)}
          </div>
        </div>

        <div class="card-matched-menu">
          <div>
            <span class="matched-label">${highlightLabel}</span>
            <span class="${matchedClass}">${escapeHtml(res._displayMenu.name)}</span>
          </div>
          <span class="matched-menu-price">${res._displayMenu.price.toLocaleString()}원</span>
        </div>

        <div class="card-info-row">
          <span class="card-dist">🏃 도보 ${res.distance}m</span>
          <span>💬 리뷰 ${res.reviewCount}개</span>
        </div>

        <div class="card-tags">
          ${tagsHtml}
          ${res.isSoloFriendly ? '<span class="card-tag" style="background-color: hsl(150, 100%, 95%); color: hsl(150, 80%, 30%);">#혼밥가능</span>' : ''}
          ${res.hasGroupSeats ? `<span class="card-tag" style="background-color: hsl(200, 100%, 95%); color: hsl(200, 80%, 30%);">#단체석(${res.groupCapacity}석)</span>` : ''}
        </div>
      </div>
    `;
  }).join("");
}

// View Detail Screen
function viewRestaurantDetail(restaurantId) {
  const target = restaurants.find(r => r.id === restaurantId);
  if (!target) return;
  
  currentRestaurant = target;
  renderDetailScreen();
  showView("detailView");
}

function renderDetailScreen() {
  const res = currentRestaurant;
  
  // 1. Hero Card Area
  const starsHtml = '★'.repeat(Math.round(res.rating)) + '☆'.repeat(5 - Math.round(res.rating));
  detailHeroCard.innerHTML = `
    <span class="detail-cat">${escapeHtml(res.category)} &middot; ${escapeHtml(res.area)}</span>
    <h2>${escapeHtml(res.name)}</h2>
    <div class="detail-stats-row">
      <span class="detail-stat">⭐ 평점 <strong>${res.rating.toFixed(1)}</strong></span>
      <span class="detail-stat">🧾 영수증 인증 리뷰 <strong>${res.reviewCount}</strong>개</span>
      <span class="detail-stat">🏃 도보 거리 <strong>${res.distance}m</strong></span>
      <span class="detail-stat">🍱 혼밥: <strong>${res.isSoloFriendly ? "가능 (#1인석)" : "불가"}</strong></span>
      <span class="detail-stat">👥 단체석: <strong>${res.hasGroupSeats ? `${res.groupCapacity}석 가능` : "소형 매장"}</strong></span>
    </div>
  `;

  // 2. Menu list
  detailMenuList.innerHTML = res.menus.map(menu => `
    <li class="detail-menu-item">
      <span class="detail-m-name">${escapeHtml(menu.name)}</span>
      <span class="detail-m-price">${menu.price.toLocaleString()}원</span>
    </li>
  `).join("");

  // 3. Rating summary box
  // Calculate distribution of stars
  const starsDist = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 star counts
  res.reviews.forEach(r => {
    const starIdx = Math.max(1, Math.min(5, Math.round(r.rating))) - 1;
    starsDist[4 - starIdx]++; // index 0 is 5 stars, index 4 is 1 star
  });
  const maxReviews = Math.max(...starsDist, 1);

  detailRatingSummary.innerHTML = `
    <div class="rating-big-box">
      <div class="rating-big-num">${res.rating.toFixed(1)}</div>
      <div class="rating-big-stars">★★★★★</div>
      <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">학우 인증 평점</p>
    </div>
    <div class="rating-bars-box">
      ${starsDist.map((count, idx) => {
        const starNum = 5 - idx;
        const pct = (count / res.reviews.length) * 100 || 0;
        return `
          <div class="rating-bar-row">
            <span>${starNum}점</span>
            <div class="rating-bar-bg">
              <div class="rating-bar-fill" style="width: ${pct}%"></div>
            </div>
            <span>${count}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;

  // 4. Review count and list
  detailReviewsCount.textContent = res.reviews.length;
  renderReviewsList();
}

function renderReviewsList() {
  const feed = detailReviewsFeed;
  const res = currentRestaurant;
  
  if (res.reviews.length === 0) {
    feed.innerHTML = `
      <p style="text-align:center; padding:30px 0; color:var(--text-secondary);">인증된 학우 리뷰가 아직 없습니다. 최초 리뷰어가 되어보세요!</p>
    `;
    return;
  }

  // Sort reviews by date descending
  const sortedReviews = [...res.reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

  feed.innerHTML = sortedReviews.map(rev => {
    const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
    return `
      <div class="review-card">
        <div class="review-card-header">
          <div class="review-user-info">
            <span class="review-user-name">${escapeHtml(rev.user)}</span>
            ${rev.isReceiptCertified ? '<span class="badge-certified">🧾 영수증 인증</span>' : ''}
          </div>
          <span class="review-date">${escapeHtml(rev.date)}</span>
        </div>
        <div class="review-rating-stars" style="margin-bottom: 6px;">${stars}</div>
        <p class="review-content">${escapeHtml(rev.content)}</p>
      </div>
    `;
  }).join("");
}

// OCR Receipt Scan Simulator
function handleReceiptSimulation() {
  if (!currentRestaurant) return;
  
  btnSimulateReceipt.disabled = true;
  btnSimulateReceipt.textContent = "🧾 영수증 분석 중 (OCR)...";
  receiptStatusDisplay.className = "receipt-status-display";
  receiptStatusDisplay.textContent = "영수증 이미지 스캔 중... 잠시만 기다려주세요.";

  setTimeout(() => {
    btnSimulateReceipt.disabled = false;
    btnSimulateReceipt.textContent = "🧾 영수증 이미지 가져오기 (시뮬레이터)";
    
    // Choose one menu from the current restaurant for the receipt simulation
    const menuObj = currentRestaurant.menus[0];
    const timestamp = new Date().toLocaleDateString("ko-KR");
    
    // Set simulator inputs
    reviewReceiptStatus.value = "certified";
    receiptStatusDisplay.className = "receipt-status-display success";
    receiptStatusDisplay.innerHTML = `
      ✅ <strong>인증 완료!</strong> [${currentRestaurant.name} - ${menuObj.name} 결제 확인]<br>
      결제 일시: ${timestamp} &middot; 결제 금액: ${menuObj.price.toLocaleString()}원 &middot; 국세청 승인 완료
    `;
  }, 1200);
}

// Submit Review Logic
function handleReviewSubmit(e) {
  e.preventDefault();
  
  if (!currentUser) {
    alert("리뷰 작성을 위해 먼저 로그인해 주세요.");
    showView("authView");
    return;
  }

  if (reviewReceiptStatus.value !== "certified") {
    alert("영수증 신뢰 인증을 먼저 완료해야 인증 리뷰 등록이 가능합니다.");
    return;
  }

  const ratingVal = parseInt(reviewRating.value);
  const textVal = reviewText.value.trim();
  
  if (!textVal) {
    alert("리뷰 내용을 적어주세요.");
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  const newReview = {
    id: `rev-${currentRestaurant.id}-${Date.now()}`,
    user: currentUser.username,
    rating: ratingVal,
    content: textVal,
    isReceiptCertified: true,
    date: today
  };

  // Add review to array
  currentRestaurant.reviews.push(newReview);
  
  // Re-calculate average rating
  const totalRating = currentRestaurant.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  currentRestaurant.rating = totalRating / currentRestaurant.reviews.length;
  currentRestaurant.reviewCount = currentRestaurant.reviews.length;

  // Save changes to localStorage database
  const resIndex = restaurants.findIndex(r => r.id === currentRestaurant.id);
  if (resIndex !== -1) {
    restaurants[resIndex] = currentRestaurant;
    localStorage.setItem("menuFinderRestaurants", JSON.stringify(restaurants));
  }

  // Reset form status
  reviewText.value = "";
  reviewReceiptStatus.value = "";
  receiptStatusDisplay.className = "receipt-status-display";
  receiptStatusDisplay.textContent = "인증 대기 중 (영수증을 첨부해야 신뢰 리뷰 등록이 가능합니다)";

  // Re-render
  renderDetailScreen();
  alert("영수증 인증 리뷰가 성공적으로 등록되었습니다!");
}

// Utility: HTML Sanitizer
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
