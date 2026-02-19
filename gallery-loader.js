document.addEventListener("DOMContentLoaded", async () => {

  // Map HTML div IDs to gallery sections
  const sections = [
    { id: "sec1", folder: "Section 1/" },
    { id: "sec2", folder: "Section 2/" },
    { id: "sec3", folder: "Section 3/" },
    { id: "sec4", folder: "Section 4/" },
    { id: "sec5", folder: "Section 5/" },
    { id: "sec6", folder: "Section 6/" },
  ];

  // Load all galleries sequentially
  for (const section of sections) {
    await loadGallery(section.id, section.folder);
  }

  // Initialize GLightbox after all images/videos are loaded
  GLightbox({
    selector: '.glightbox',
    loop: true,
    touchNavigation: true,
    openEffect: 'zoom',
    closeEffect: 'fade'
  });
});

// Video detection helper
function isVideo(url) {
  return /\.(mp4|mov|webm|ogg)$/i.test(url);
}

// Load gallery media for a section
async function loadGallery(divId, folder) {
  const galleryDiv = document.getElementById(divId);
  if (!galleryDiv) {
    console.error("Gallery div not found:", divId);
    return;
  }

  try {
const res = await fetch(`/api/list-media?prefix=${folder}`);
const files = await res.json();

if (!files || files.length === 0) {
  console.warn(`No files returned for folder: ${folder}`);
  return;
}

    // Append each media item
    files.forEach(url => {
      const a = document.createElement('a');
      a.href = url;
      a.className = 'glightbox';

      if (isVideo(url)) {
        a.dataset.type = 'video';

        const video = document.createElement('video');
        video.src = url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;

        video.style.width = '250px';
        video.style.margin = '5px';

        a.appendChild(video);
      } else {
        a.dataset.type = 'image';

        const img = document.createElement('img');
        img.src = url;
        img.style.width = '250px';
        img.style.height = 'auto';
        img.style.margin = '5px';

        a.appendChild(img);
      }

      galleryDiv.appendChild(a);
    });

  } catch (err) {
    console.error(`Failed to load media for folder "${folder}":`, err);
  }
}
