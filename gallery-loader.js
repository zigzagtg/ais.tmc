document.addEventListener("DOMContentLoaded", async () => {

  // Map HTML div IDs to Backblaze folders
  const sections = [
    { id: "sec1", folder: "Section 1/" },
    { id: "sec2", folder: "Section 2/" },
    { id: "sec3", folder: "Section 3/" },
    { id: "sec4", folder: "Section 4/" },
    { id: "sec5", folder: "Section 5/" }
  ];

  // Load all galleries
  for (const section of sections) {
    await loadGallery(section.id, section.folder);
  }

  // === Initialize GLightbox (default) ===
  GLightbox({
    selector: '.glightbox',
    loop: true,
    touchNavigation: true,
    openEffect: 'zoom',
    closeEffect: 'fade'
  });

  // === After images load, apply masonry row spans ===
  resizeMasonry();
  window.addEventListener('resize', resizeMasonry);
});

// Fetch and display images for a section
async function loadGallery(divId, folder) {
  const galleryDiv = document.getElementById(divId);
  if (!galleryDiv) {
    console.error("Gallery div not found:", divId);
    return;
  }

  try {
    const encodedFolder = encodeURIComponent(folder);
    const res = await fetch(`/api/list-media?prefix=${encodedFolder}`);
    const files = await res.json();

    if (!files || files.length === 0) {
      console.warn(`No files returned for folder: ${folder}`);
      return;
    }

    files.forEach(url => {
      const a = document.createElement('a');
      a.href = url;
      a.className = 'glightbox';
      a.dataset.type = 'image';

      const img = document.createElement('img');
      img.src = url;
      img.style.width = '100%';   // responsive
      img.style.height = 'auto';  // natural ratio
      img.style.display = 'block';
      img.style.borderRadius = '6px';
      img.style.margin = '0';
      img.style.transition = 'transform 0.3s ease'; // hover zoom

      a.appendChild(img);
      galleryDiv.appendChild(a);
    });

  } catch (err) {
    console.error(`Failed to load media for folder "${folder}":`, err);
  }
}

// Masonry layout adjustment
function resizeMasonry() {
  const galleries = document.querySelectorAll('.gallery');
  galleries.forEach(gallery => {
    const rowHeight = parseInt(getComputedStyle(gallery).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(getComputedStyle(gallery).getPropertyValue('grid-gap'));
    gallery.querySelectorAll('img').forEach(img => {
      const rowSpan = Math.ceil((img.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
      img.style.gridRowEnd = `span ${rowSpan}`;
    });
  });
}
