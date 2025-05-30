// Import store HTML content
const storeHTML = await fetch('./src/views/store/index.html').then(res => res.text());

export function loadStoreContent() {
    return storeHTML;
}
