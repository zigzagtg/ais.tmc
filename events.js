
/* =========================================
   T.M.C EVENTS PAGE JAVASCRIPT
========================================= */


/* =========================================
   MOBILE NAVIGATION
========================================= */

(function () {

    const navButton = document.querySelector(".nav-toggle");
    const navigation = document.getElementById("site-navigation");

    if (!navButton || !navigation) return;

    navButton.addEventListener("click", function () {

        const expanded =
            this.getAttribute("aria-expanded") === "true";

        this.setAttribute("aria-expanded", String(!expanded));
        navigation.classList.toggle("is-open");

    });

    navigation.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            navButton.setAttribute("aria-expanded", "false");
            navigation.classList.remove("is-open");

        });

    });

})();


/* =========================================
   MAIN EVENT CATEGORY ACCORDION
========================================= */

(function () {

    const categoryCards =
        document.querySelectorAll(".category-card");

    const eventSections =
        document.querySelectorAll(".expandable-section");

    if (!categoryCards.length || !eventSections.length) return;

    function closeAllCategories() {

        eventSections.forEach(function (section) {
            section.hidden = true;
        });

        categoryCards.forEach(function (card) {

            card.classList.remove("is-expanded");
            card.setAttribute("aria-expanded", "false");

        });

    }

    categoryCards.forEach(function (card) {

        card.addEventListener("click", function () {

            const targetId = this.dataset.category;
            const targetSection = document.getElementById(targetId);

            if (!targetSection) return;

            const alreadyOpen = !targetSection.hidden;

            closeAllCategories();

            if (!alreadyOpen) {

                targetSection.hidden = false;

                this.classList.add("is-expanded");
                this.setAttribute("aria-expanded", "true");

                setTimeout(function () {

                    targetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }, 50);

            }

        });

    });

})();


/* =========================================
   FULL-SCREEN SPORT GALLERIES
========================================= */

(function () {

    const sportCards =
        document.querySelectorAll(".sport-card");

    const galleryView =
        document.getElementById("sport-gallery-view");

    const galleryBack =
        document.getElementById("gallery-back");

    const galleryTitle =
        document.getElementById("sport-gallery-title");

    const galleryDescription =
        document.getElementById("sport-gallery-description");

    const galleryGrid =
        document.getElementById("sport-gallery-grid");

    const emptyMessage =
        document.getElementById("gallery-empty-message");

    if (
        !sportCards.length ||
        !galleryView ||
        !galleryBack ||
        !galleryTitle ||
        !galleryGrid
    ) return;


    let previousFocus = null;


    /*
       Add actual media URLs here later.

       Example:

       football: [
           {
               type: "image",
               src: "https://media.aismediaclub.com/Section%201/example.jpg",
               alt: "Football match at AIS"
           },
           {
               type: "video",
               src: "https://media.aismediaclub.com/Section%201/example.mp4",
               alt: "Football highlights"
           }
       ]

       Keep each sport's media inside its own array.
    */

    const sportMedia = {
        football: [],
        basketball: [],
        tennis: [],
        handball: [],
        "table-tennis": [],
        hockey: [],
        swimming: []
    };


    const sportDescriptions = {
        football: "Matches, goals, teamwork and memorable moments from football at AIS.",
        basketball: "Fast plays, competition and highlights from basketball at AIS.",
        tennis: "Rallies, matches and memorable moments from tennis at AIS.",
        handball: "Teamwork, speed and competition from handball at AIS.",
        "table-tennis": "Quick rallies, sharp reactions and table tennis highlights from AIS.",
        hockey: "Skills, teamwork and match highlights from hockey at AIS.",
        swimming: "Races, achievements and swimming moments from AIS."
    };


    function createMediaItem(item) {

        const wrapper = document.createElement("div");
        wrapper.className = "sport-media-item";

        if (item.type === "video") {

            const video = document.createElement("video");

            video.src = item.src;
            video.controls = true;
            video.preload = "metadata";
            video.playsInline = true;

            wrapper.appendChild(video);

        } else {

            const image = document.createElement("img");

            image.src = item.src;
            image.alt = item.alt || "AIS sports photograph";
            image.loading = "lazy";

            wrapper.appendChild(image);

        }

        return wrapper;

    }


    function createPlaceholder(index) {

        const wrapper = document.createElement("div");
        wrapper.className = "sport-media-placeholder";

        const icon = document.createElement("span");
        icon.textContent = index === 0 ? "📸" : "🎬";

        const text = document.createElement("p");
        text.textContent = "Sports media will appear here";

        wrapper.appendChild(icon);
        wrapper.appendChild(text);

        return wrapper;

    }


    function openGallery(card) {

        const sport = card.dataset.sport;

        const title =
            card.querySelector(".sport-card-title").textContent;

        previousFocus = document.activeElement;

        galleryTitle.textContent = title;

        galleryDescription.textContent =
            sportDescriptions[sport] || "Explore sports coverage from AIS.";

        galleryGrid.replaceChildren();

        const media = sportMedia[sport] || [];

        if (media.length > 0) {

            media.forEach(function (item) {
                galleryGrid.appendChild(createMediaItem(item));
            });

            emptyMessage.hidden = true;

        } else {

            emptyMessage.hidden = false;

            /*
               These placeholders show the future gallery layout.
               Replace them with real media by adding URLs to sportMedia.
            */

            for (let i = 0; i < 3; i++) {
                galleryGrid.appendChild(createPlaceholder(i));
            }

        }

        galleryView.hidden = false;
        document.body.classList.add("gallery-open");

        galleryView.scrollTop = 0;
        galleryBack.focus();

    }


    function closeGallery() {

        if (galleryView.hidden) return;

        galleryView.hidden = true;
        document.body.classList.remove("gallery-open");

        galleryGrid.querySelectorAll("video").forEach(function (video) {
            video.pause();
            video.removeAttribute("src");
            video.load();
        });

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }

    }


    sportCards.forEach(function (card) {

        card.addEventListener("click", function () {
            openGallery(this);
        });

    });


    galleryBack.addEventListener("click", closeGallery);


    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape" && !galleryView.hidden) {
            closeGallery();
        }

    });

})();


/* =========================================
   SPORTS FILTERS
========================================= */

(function () {

    const filterButtons =
        document.querySelectorAll(".sport-filter");

    const sportCards =
        document.querySelectorAll(".sport-card");

    const emptyMessage =
        document.querySelector(".sports-empty");

    if (!filterButtons.length || !sportCards.length) return;


    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedSport = this.dataset.filter;

            filterButtons.forEach(function (filter) {

                filter.classList.remove("active");
                filter.setAttribute("aria-pressed", "false");

            });

            this.classList.add("active");
            this.setAttribute("aria-pressed", "true");


            let visibleCards = 0;

            sportCards.forEach(function (card) {

                const matches =
                    selectedSport === "all" ||
                    selectedSport === card.dataset.sport;

                card.hidden = !matches;

                if (matches) visibleCards++;

            });


            if (emptyMessage) {
                emptyMessage.hidden = visibleCards !== 0;
            }

        });

    });

})();
