async function loadGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = ""; // Clear previous content

  try {
    const response = await fetch("/api/list-media");
    const urls = await response.json();

    if (!urls || urls.length === 0) {
      gallery.innerHTML = "<p>No media available yet.</p>";
      return;
    }

    urls.forEach(url => {
      // Determine file type by extension
      const extension = url.split(".").pop().toLowerCase();

      if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        // IMAGE
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Media";
        img.style.width = "200px";
        img.style.margin = "5px";
        img.loading = "lazy"; // Lazy loading
        gallery.appendChild(img);

      } else if (["mp4", "webm", "ogg"].includes(extension)) {
        // VIDEO
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        video.style.width = "300px";
        video.style.margin = "5px";
        video.preload = "metadata";
        gallery.appendChild(video);

      } else {
        // Unsupported file type, ignore or log
        console.warn("Unsupported media type:", url);
      }
    });

  } catch (err) {
    console.error("Error loading media:", err);
    gallery.innerHTML = "<p>Failed to load media.</p>";
  }
}

// Run the function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadGallery);