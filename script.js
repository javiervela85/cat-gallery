// Configuration
const API_KEY = 'live_xKxwYWpYPAqsZOBWCQa9z1HA2OvXyWxwmJXKqZgOGrFwVvdA0PAEaP1kNbDaHCTy'; // Free tier key from TheCAT API
const API_URL = 'https://api.thecatapi.com/v1/images/search';
const IMAGES_PER_PAGE = 12;

// State
let currentPage = 0;
let isLoading = false;
let hasMore = true;

// DOM Elements
const gallery = document.getElementById('gallery');
const loadingElement = document.getElementById('loading');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMoreCats();
    window.addEventListener('scroll', handleScroll);
});

/**
 * Fetch cat images from The Cat API
 */
async function fetchCatImages() {
    try {
        isLoading = true;
        showLoading();

        const params = new URLSearchParams({
            limit: IMAGES_PER_PAGE,
            page: currentPage,
            order: 'RANDOM',
            breed_ids: 'rubi' // Russian Blue cats
        });

        const response = await fetch(`${API_URL}?${params}`, {
            headers: {
                'x-api-key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusCode}`);
        }

        const cats = await response.json();
        
        if (cats.length < IMAGES_PER_PAGE) {
            hasMore = true; // API allows continuous fetching
        }

        return cats;
    } catch (error) {
        console.error('Error fetching cats:', error);
        showError('Failed to load cats. Please try again.');
        return [];
    } finally {
        isLoading = false;
        hideLoading();
    }
}

/**
 * Create and append cat cards to gallery
 */
function displayCats(cats) {
    cats.forEach((cat) => {
        const card = createCatCard(cat);
        gallery.appendChild(card);
    });
}

/**
 * Create a cat card element
 */
function createCatCard(cat) {
    const card = document.createElement('div');
    card.className = 'cat-card';
    
    const img = document.createElement('img');
    img.className = 'cat-image';
    img.src = cat.url;
    img.alt = 'Funny cat picture';
    img.loading = 'lazy';
    
    const info = document.createElement('div');
    info.className = 'cat-info';
    info.innerHTML = `<p>ID: ${cat.id.substring(0, 8)}</p>`;
    
    card.appendChild(img);
    card.appendChild(info);
    
    return card;
}

/**
 * Load more cats (combine fetch + display)
 */
async function loadMoreCats() {
    if (isLoading || !hasMore) return;
    
    const cats = await fetchCatImages();
    if (cats.length > 0) {
        displayCats(cats);
        currentPage++;
    }
}

/**
 * Handle infinite scroll logic
 */
function handleScroll() {
    // Check if user has scrolled near the bottom
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 500;
    
    if (scrollPosition >= threshold && !isLoading && hasMore) {
        loadMoreCats();
    }
}

/**
 * Show loading spinner
 */
function showLoading() {
    loadingElement.classList.add('active');
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    loadingElement.classList.remove('active');
}

/**
 * Display error message
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    gallery.parentElement.appendChild(errorDiv);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
