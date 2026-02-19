// Only preload once per tab/session
if (!window.preloadedGallery) {
  window.preloadedGallery = {}; // store JSON per folder
  window.preloadedGalleryLoaded = {}; // track loaded folders

  // List all gallery sections
  const sections = [
    "Section 1/",
    "Section 2/",
    "Section 3/",
    "Section 4/",
    "Section 5/",
    "Section 6/"
  ];

  // Preload each section individually
  sections.forEach(folder => {
    // Skip if already loaded
    if (window.preloadedGalleryLoaded[folder]) return;

    const encodedFolder = encodeURIComponent(folder);

    fetch(`/api/list-media?prefix=${encodedFolder}&_=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Skip any empty/blank entries
          window.preloadedGallery[folder] = data.filter(url => url && !url.endsWith("/"));
          window.preloadedGalleryLoaded[folder] = true;
        } else {
          console.warn(`Gallery preload returned invalid data for folder "${folder}"`);
        }
      })
      .catch(err => console.error(`Gallery preload error for folder "${folder}":`, err));
  });
}
