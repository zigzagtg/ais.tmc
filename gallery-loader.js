async function loadGallery(section, folder) {
  const galleryDiv = document.getElementById(section + '-gallery');

  // Fetch media URLs from your API, passing folder prefix
  const res = await fetch(`/api/list-media?prefix=${folder}`);
  const files = await res.json();

  files.forEach(url => {
    const container = document.createElement('div');
    container.className = 'media-item';

    // Lightbox clickable element
    const a = document.createElement('a');
    a.href = url;
    a.className = 'glightbox';
    a.dataset.type = url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image';

    const el = url.match(/\.(mp4|webm|ogg)$/i) 
      ? Object.assign(document.createElement('video'), { src: url, controls: true })
      : Object.assign(document.createElement('img'), { src: url });

    a.appendChild(el);

    // Optional download button
    const download = document.createElement('a');
    download.href = url;
    download.download = '';
    download.textContent = 'Download';
    download.className = 'download-btn';

    container.appendChild(a);
    container.appendChild(download);

    galleryDiv.appendChild(container);
  });
}

// Load multiple sections
loadGallery('sec1', 'Gallery/Section 1/');
loadGallery('sec2', 'Gallery/Section 2/');

// Initialize GLightbox
const lightbox = GLightbox({ selector: '.glightbox' });
