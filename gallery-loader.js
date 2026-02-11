// gallery-loader.js

document.addEventListener("DOMContentLoaded", async () => {

  // Map your section names to their HTML div IDs
  const sections = [
    { id: "sec1", folder: "Section 1/" },
    { id: "sec2", folder: "Section 2/" },
    { id: "sec3", folder: "Section 3/" },
    { id: "sec4", folder: "Section 4/" },
    { id: "sec5", folder: "Section 5/" }
  ];

  // Loop through each section
  for (const section of sections) {
    await loadGallery(section.id, section.folder);
  }

  // Initialize GLightbox AFTER all galleries are populated
  const lightbox = GLightbox({ selector: '.glightbox' });
});

async function loadGallery(divId, folder) {
  const galleryDiv = document.getElementById(divId);
  if (!galleryDiv) {
    console.error("Gallery div not found:", divId);
    return;
  }

  try {
    // Fetch files from your API, passing the folder prefix
    const res = await fetch(`/api/list-media?prefix=${encodeURIComponent(folder)}`);
    const files = await res.json();

    if (!files || files.length === 0) {
      console.warn(`No files returned for folder: ${folder}`);
      return;
    }

    files.forEach(url => {
      const container = document.createElement('div');
      container.className = 'media-item';

      // Create clickable element for GLightbox
      const a = document.createElement('a');
      a.href = url;
      a.className = 'glightbox';
      a.dataset.type = url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image';

      // Create image or video element
      const el = url.match(/\.(mp4|webm|ogg)$/i) 
        ? Object.assign(document.createElement('video'), { src: url, controls: true })
        : Object.assign(document.createElement('img'), { src: url });

      a.appendChild(el);

      // Download button
      const download = document.createElement('a');
      download.href = url;
      download.download = '';
      download.textContent = 'Download';
      download.className = 'download-btn';

      container.appendChild(a);
      container.appendChild(download);
      galleryDiv.appendChild(container);
    });

  } catch (err) {
    console.error("Failed to load media for folder:", folder, err);
  }
}
