/* ==========================================================
   HELPER: Format nama ke URL aman
   ========================================================== */
function formatToSafeUrl(name) {
    return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");
}

/* ==========================================================
   1. LOGIC: SVG MAP (hover + tooltip + redirect)
   ========================================================== */
function setupMapInteractivity() {
    const mapContainer = document.getElementById("map-container");
    const tooltip = document.getElementById("tooltip");
    const imageContainer = document.getElementById("tooltip-image-container");
    const textContainer = document.getElementById("tooltip-text-container");

    if (!mapContainer || !tooltip) return;

    const mapGroups = mapContainer.querySelectorAll("g[data-name]");

    mapGroups.forEach((groupElement) => {
        const regionName = groupElement.getAttribute("data-name");
        const imageUrl = groupElement.getAttribute("data-image");
        const typeName = groupElement.getAttribute("data-type");

        if (!regionName) return;

        const safeName = formatToSafeUrl(regionName);
        const targetUrl = `data/daerah/${typeName}/${safeName}.html`;

        // CLICK → redirect
        groupElement.addEventListener("click", () => {
            window.location.href = targetUrl;
        });

        groupElement.style.cursor = "pointer";

        // HOVER Tooltip
        groupElement.addEventListener("mouseenter", () => {
            textContainer.textContent = regionName.toUpperCase();

            if (imageUrl) {
                imageContainer.style.backgroundImage = `url('${imageUrl}')`;
                imageContainer.style.backgroundColor = "transparent";
            } else {
                imageContainer.style.backgroundImage = "none";
                imageContainer.style.backgroundColor = "#6c757d";
            }

            tooltip.style.opacity = 1;
            groupElement.classList.add("hovered");
        });

        groupElement.addEventListener("mousemove", (event) => {
            tooltip.style.left = event.pageX + 15 + "px";
            tooltip.style.top = event.pageY - 15 + "px";
        });

        groupElement.addEventListener("mouseleave", () => {
            tooltip.style.opacity = 0;
            groupElement.classList.remove("hovered");
        });
    });
}

/* ==========================================================
   2. LOGIC: NAV KOTA & KABUPATEN → redirect seperti SVG
   ========================================================== */
function setupNavRedirect() {
    const navItems = document.querySelectorAll(".dropdown-item[data-name]");

    navItems.forEach((item) => {
        const name = item.getAttribute("data-name");
        const type = item.getAttribute("data-type");

        if (!name || !type) return;

        const safeName = formatToSafeUrl(name);
        const targetUrl = `data/daerah/${type}/${type}-${safeName}.html`;

        item.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = targetUrl;
        });

        item.style.cursor = "pointer";
    });
}

/* ==========================================================
   3. SMOOTH SCROLL
   ========================================================== */
function smoothScroll(targetElement, duration) {
    const targetPosition = targetElement.offsetTop || 0;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function ease(t, b, c, d) {
        return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;

        const timeElapsed = currentTime - startTime;

        if (timeElapsed < duration) {
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            requestAnimationFrame(animation);
        } else {
            window.scrollTo(0, targetPosition);
        }
    }

    requestAnimationFrame(animation);
}

/* ==========================================================
   4. LOGIC: Scroll To Top Button
   ========================================================== */
function setupScrollToTop() {
    const btn = document.getElementById("scrollToTopBtn");
    if (!btn) return;

    const SHOW_AT = 300;

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > SHOW_AT) {
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    });

    btn.addEventListener("click", () => {
        smoothScroll(document.body, 600);
    });
}

/* ==========================================================
   INIT
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    setupMapInteractivity();
    setupNavRedirect();
    setupScrollToTop();
});
