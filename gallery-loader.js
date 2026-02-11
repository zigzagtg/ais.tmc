async function loadGallery() {
  const gallery = document.getElementById("gallery");

  const res = await fetch("/api/list-media");
  const files = await res.json();

  files.forEach(url => {
    let el;

    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      el = document.createElement("video");
      el.src = url;
      el.controls = true;
    } else {
      el = document.createElement("img");
      el.src = url;
    }

    gallery.appendChild(el);
  });
}

loadGallery();
