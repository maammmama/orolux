// Video arrays
const videos = [
    './videos/first-animation.mp4',
    './videos/secound-anmation.mp4',
    './videos/therdvideo-anmation.mp4'
];

// Image arrays
const trendingImages = [
    'https://content.rolex.com/dam/2022/upright-bba/m116500ln-0001.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126711chnr-0002.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126613lb-0002.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126710blro-0001.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m124060-0001.png?impolicy=main-configurator&imwidth=800'
];

const featuredCollectionImages = [
    'https://content.rolex.com/dam/2022/upright-bba/m126283rbr-0031.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126234-0051.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m226658-0001.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126900-0001.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126720vtnr-0001.png?impolicy=main-configurator&imwidth=800'
];

const brandImages = [
    'https://content.rolex.com/dam/2022/upright-bba/m116519ln-0024.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126619lb-0003.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m228236-0012.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m50535-0002.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m326238-0006.png?impolicy=main-configurator&imwidth=800'
];

// Helper functions
function getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function handleImageError(img) {
    console.error(`Failed to load image: ${img.src}`);
    img.src = `https://via.placeholder.com/400x400?text=${encodeURIComponent(img.alt)}`;
}

function updateRandomImages() {
    // Update Trending Now section
    document.querySelectorAll('.trending-now').forEach((img, index) => {
        const randomTrending = getRandomElements(trendingImages, 1)[0];
        img.onerror = () => handleImageError(img);
        img.src = randomTrending;
    });

    // Update Featured Collections section
    document.querySelectorAll('.featured-collection').forEach((img, index) => {
        const randomFeatured = getRandomElements(featuredCollectionImages, 1)[0];
        img.onerror = () => handleImageError(img);
        img.src = randomFeatured;
    });

    // Update Our Brands section
    document.querySelectorAll('.brand-image').forEach((img, index) => {
        const randomBrand = getRandomElements(brandImages, 1)[0];
        img.onerror = () => handleImageError(img);
        img.src = randomBrand;
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize menu
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('hidden');
    });

    // Initialize hero video
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        const source = document.createElement('source');
        source.src = randomVideo;
        source.type = 'video/mp4';
        heroVideo.appendChild(source);
        heroVideo.load();
    }

    // Initialize images
    updateRandomImages();
});
