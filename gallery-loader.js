document.addEventListener("DOMContentLoaded", async () => {

  // Map HTML div IDs to Backblaze folders
  const sections = [
    { id: "sec1", folder: "Section 1/" },
    { id: "sec2", folder: "Section 2/" },
    { id: "sec3", folder: "Section 3/" },
    { id: "sec4", folder: "Section 4/" },
    { id: "sec5", folder: "Section 5/" }
  ];

  // Load all galleries sequentially
  for (const section of sections) {
    await loadGallery(section.id, section.folder);
  }

  // Initialize GLightbox after all galleries are loaded
  GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    download: true // download button inside lightbox
  });
});

async function loadGallery(divId, folder) {
  const galleryDiv = document.getElementById(divId);
  if (!galleryDiv) {
    console.error("Gallery div not found:", divId);
    return;
  }

  try {
    // Encode folder for URL (handles spaces)
    const encodedFolder = encodeURIComponent(folder);

    // Fetch images for this folder from your API
    const res = await fetch(`/api/list-media?prefix=${encodedFolder}`);
    const files = await res.json();

    if (!files || files.length === 0) {
      console.warn(`No files returned for folder: ${folder}`);
      return;
    }

    // Append each image to the gallery div
    files.forEach(url => {
      const a = document.createElement('a');
      a.href = url;
      a.className = 'glightbox';
      a.dataset.type = 'image';
      a.dataset.downloadUrl = url; // download inside lightbox

      const img = document.createElement('img');
      img.src = url;
      img.style.width = '250px'; // consistent width
      img.style.height = 'auto';
      img.style.margin = '5px'; // spacing between images

      a.appendChild(img);
      galleryDiv.appendChild(a);
    });

  } catch (err) {
    console.error(`Failed to load media for folder "${folder}":`, err);
  }
}
