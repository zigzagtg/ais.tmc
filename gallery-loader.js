document.addEventListener("DOMContentLoaded", async () => {

  // Map Backblaze folders to HTML div IDs
  const sections = [
    { id: "sec1", folder: "Section 1/" },
    { id: "sec2", folder: "Section 2/" },
    { id: "sec3", folder: "Section 3/" },
    { id: "sec4", folder: "Section 4/" },
    { id: "sec5", folder: "Section 5/" }
  ];

  // Load each section sequentially
  for (const section of sections) {
    await loadGallery(section.id, section.folder);
  }

  // Initialize GLightbox after all galleries are populated
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    download: true // enables toolbar download inside lightbox
  });
});

async function loadGallery(divId, folder) {
  const galleryDiv = document.getElementById(divId);
  if (!galleryDiv) {
    console.error("Gallery div not found:", divId);
    return;
  }

  try {
    // Encode folder name to handle spaces
    const encodedFolder = encodeURIComponent(folder);

    // Fetch files from API with folder prefix
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
      a.dataset.type = url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image';
      a.dataset.downloadUrl = url; // download inside lightbox

      const el = url.match(/\.(mp4|webm|ogg)$/i)
        ? Object.assign(document.createElement('video'), { src: url, controls: true, width: 250 })
        : Object.assign(document.createElement('img'), { src: url, width: 250 });

      a.appendChild(el);
      galleryDiv.appendChild(a);
    });

  } catch (err) {
    console.error("Failed to load media for folder:", folder, err);
  }
}
