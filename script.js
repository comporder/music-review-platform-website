/**
 * @fileoverview Müzik değerlendirme uygulaması için JavaScript kodu.
 * Kullanıcı oturumu, değerlendirme ekleme ve görüntüleme işlevlerini içerir.
 */

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const modalOverlay = document.getElementById('modal-overlay');
const modal = document.getElementById('review-modal');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalUser = document.getElementById('modal-user');
const modalCategory = document.getElementById('modal-category');
const modalComment = document.getElementById('modal-comment');
const modalRating = document.getElementById('modal-rating');
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

/**
 * Oturum bilgisini temizler ve kimlik doğrulama ekranını gösterir.
 */
function logout() {
    sessionStorage.removeItem('loggedInUser');
    showAuth();
}

// Login ve Register arası geçiş
showRegister.addEventListener('click', () => {
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

showLogin.addEventListener('click', () => {
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// Local Storage'da Kullanıcı Kontrolü
const users = JSON.parse(localStorage.getItem('users')) || [];

/**
 * Kullanıcı girişini kontrol eder ve oturum açar.
 */
document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        alert(`Hoş geldiniz, ${user.name}!`);
        sessionStorage.setItem('loggedInUser', username);
        showApp();
    } else {
        alert('Geçersiz kullanıcı adı veya şifre.');
    }

    // Alanları temizle
    document.getElementById('auth-username').value = '';
    document.getElementById('auth-password').value = '';
});

/**
 * Yeni kullanıcı kaydını gerçekleştirir.
 */
document.getElementById('register-btn').addEventListener('click', () => {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (!name || !email || !username || !password) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }

    if (users.some(user => user.username === username)) {
        alert('Bu kullanıcı adı zaten mevcut.');
        return;
    }

    users.push({ name, email, username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Kayıt başarılı! Giriş yapabilirsiniz.');

    // Alanları temizler sağlıklı yeni kayıt yapılmasını sağlar
    document.getElementById('register-name').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-username').value = '';
    document.getElementById('register-password').value = '';

    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

/**
 * Sekme butonlarına tıklama olaylarını yönetir.
 */
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Modal penceresi olayları
modalOverlay.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);

/**
 * Modal penceresini kapatır.
 */
function closeModal() {
    modal.classList.remove('active');
    modalOverlay.classList.remove('active');
}

// Değerlendirme listesi
const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
const reviewListPublic = document.getElementById('review-list-public');
const reviewList = document.getElementById('review-list');

/**
 * Modal penceresini açar ve değerlendirme bilgilerini gösterir.
 * @param {Object} review - Değerlendirme bilgileri.
 */
function openModal(review) {
    modalTitle.textContent = review.title;
    modalUser.textContent = review.user;
    modalCategory.textContent = review.category;
    modalComment.textContent = review.comment;
    modalRating.textContent = '⭐'.repeat(review.rating);
    modal.classList.add('active');
    modalOverlay.classList.add('active');
}

/**
 * Oturum açmış kullanıcının değerlendirmelerini gösterir.
 */
function displayMyReviews() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert('Oturum açmış bir kullanıcı bulunamadı.');
        if (!displayMyReviews.cachedReviews) {
            displayMyReviews.cachedReviews = reviews.filter(review => review.user === loggedInUser);
        }
        const userReviews = displayMyReviews.cachedReviews;
    }

    const userReviews = reviews.filter(review => review.user === loggedInUser);

    reviewList.innerHTML = '';
    userReviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${review.thumbnail}" alt="${review.title}">
            <div class="card-content">
                <h4>${review.title}</h4>
                <p><strong>Kategori:</strong> ${review.category}</p>
                <p><strong>Puan:</strong> ${'⭐'.repeat(review.rating)}</p>
                <p><strong>Yorum:</strong> ${review.comment}</p>
            </div>
        `;
        reviewList.appendChild(card);
    });

    if (userReviews.length === 0) {
        reviewList.innerHTML = '<p>Henüz bir değerlendirme yapmadınız.</p>';
    }
}

/**
 * En başta ana sayfada herhangi bir kullanıcı tarafından bir değerlendirme yok ise,
 * rastgele YouTube videolarını çeker ve ana sayfaya değerlendirme olarak ekler.
 */
function fetchRandomYouTubeVideos() {
    const randomVideos = [
        'https://www.youtube.com/watch?v=wDjeBNv6ip0',
        'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
        'https://www.youtube.com/watch?v=JGwWNGJdvx8',
        'https://www.youtube.com/watch?v=09R8_2nJtjg',
        'https://www.youtube.com/watch?v=7wtfhZwyrcc',
        'https://www.youtube.com/watch?v=09839DpTctU',
        'https://www.youtube.com/watch?v=d27gTrPPAyk',
        'https://www.youtube.com/watch?v=6POZlJAZsok',
    ];

    if (localStorage.getItem('randomVideosFetched')) {
        return;
    }

    randomVideos.forEach(link => {
        fetch(`https://www.youtube.com/oembed?url=${link}&format=json`)
            .then(response => response.json())
            .then(data => {
                const newReview = {
                    title: data.title,
                    thumbnail: data.thumbnail_url,
                    link: link,
                    category: 'Diğer',
                    comment: 'Misafir kullanıcı tarafından eklenen otomatik değerlendirme.',
                    rating: Math.floor(Math.random() * 5) + 1,
                    user: 'Misafir'
                };

                reviews.push(newReview);
                localStorage.setItem('reviews', JSON.stringify(reviews));
                displayReviews();
            })
            .catch(() => console.error('Geçerli bir YouTube linki girin.'));
    });

    localStorage.setItem('randomVideosFetched', 'true');
}

/**
 * Tüm değerlendirmeleri gösterir.
 */
function displayReviews() {
    reviewListPublic.innerHTML = '';
    reviewList.innerHTML = '';
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const userReviews = reviews.filter(review => review.user !== 'Misafir');
    
    if (userReviews.length === 0) {
        reviews.forEach(review => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${review.thumbnail}" alt="${review.title}">
                <div class="card-content">
                    <h4>${review.title}</h4>
                    <p>${review.user}</p>
                </div>
            `;
            card.addEventListener('click', () => openModal(review));
            reviewListPublic.appendChild(card);
        });
        fetchRandomYouTubeVideos();
    } else {
        userReviews.forEach(review => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${review.thumbnail}" alt="${review.title}">
                <div class="card-content">
                    <h4>${review.title}</h4>
                    <p>${review.user}</p>
                </div>
            `;
            card.addEventListener('click', () => openModal(review));
            if (review.user === loggedInUser) {
                reviewList.appendChild(card);
            } else {
                reviewListPublic.appendChild(card);
            }
        });
    }
}

/**
 * Yeni bir değerlendirme kaydeder.
 */
document.getElementById('save-review').addEventListener('click', () => {
    const youtubeLink = document.getElementById('youtube-link').value;
    const category = document.getElementById('category').value;
    const comment = document.getElementById('comment').value;
    const rating = document.getElementById('rating').value;

    if (isNaN(rating) || rating < 1 || rating > 5) {
        alert('Lütfen 1 ile 5 arasında bir puan girin.');
        return;
    }

    if (!youtubeLink || !category || !comment || !rating) {
        alert('Lütgen tüm alanları doldurun.');
        return;
    }

    fetch(`https://www.youtube.com/oembed?url=${youtubeLink}&format=json`)
        .then(response => response.json())
        .then(data => {
            const newReview = {
                title: data.title,
                thumbnail: data.thumbnail_url,
                link: youtubeLink,
                category,
                comment,
                rating,
                user: sessionStorage.getItem('loggedInUser') || 'Guest'
            };

            reviews.push(newReview);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            displayReviews();

            document.getElementById('youtube-link').value = '';
            document.getElementById('category').value = 'Rock';
            document.getElementById('comment').value = '';
            document.getElementById('rating').value = '';

            alert('Değerlendirmeniz başarıyla paylaşıldı.');
        })
        .catch(() => alert('Geçerli bir YouTube linki girin.'));
});

/**
 * Uygulama ekranını gösterir ve ana sayfadan başlatır.
 */
function showApp() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';

    // Ana sayfa sekmesini aktif yap
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    document.querySelector('.tab-button[data-tab="home"]').classList.add('active');
    document.getElementById('home').classList.add('active');

    displayReviews();
}

/**
 * Kimlik doğrulama ekranını gösterir.
 */
function showAuth() {
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('app-container').style.display = 'none';
}

// Uygulama başlangıcı
if (sessionStorage.getItem('loggedInUser')) {
    showApp();
} else {
    showAuth();
}