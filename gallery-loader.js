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

  // Initialize GLightbox with custom download button
  GLightbox({
    selector: '.glightbox',
    loop: true,
    touchNavigation: true,
    openEffect: 'zoom',
    closeEffect: 'fade',
    onSlideAfterLoad: function (slide) {
      // Remove old button if it exists
      const existingBtn = slide.container.querySelector('.custom-download-btn');
      if (existingBtn) existingBtn.remove();

      // Create download button
      const btn = document.createElement('button');
      btn.innerText = 'Download';
      btn.className = 'custom-download-btn';
      btn.style.position = 'absolute';
      btn.style.top = '10px';
      btn.style.right = '10px';
      btn.style.padding = '6px 10px';
      btn.style.backgroundColor = '#fff';
      btn.style.border = '1px solid #333';
      btn.style.borderRadius = '4px';
      btn.style.cursor = 'pointer';
      btn.style.zIndex = 9999;

      // Force download when clicked
      btn.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = slide.node.href;
        a.download = slide.node.href.split('/').pop(); // optional: sets filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      slide.container.appendChild(btn);
    }
  });
});

// Function to fetch and display images for a section
async function loadGallery(divId, folder) {
  const galleryDiv = document.getElementById(divId);
  if (!galleryDiv) {
    console.error("Gallery div not found:", divId);
    return;
  }

  try {
    // Encode folder for fetch URL (handles spaces)
    const encodedFolder = encodeURIComponent(folder);

    // Fetch images from your API
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
      a.dataset.downloadUrl = url;

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
