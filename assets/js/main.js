// ====================================================================
// FUNGSI UTAMA SMOOTH SCROLL KUSTOM (SINE EASING)
// Digunakan untuk navigasi menu dan tombol 'Scroll to Top'
// ====================================================================
function smoothScroll(targetElement, duration) {
	// Mengambil posisi target. Jika target adalah body/html, posisinya 0.
	const targetPosition =
		targetElement.offsetTop === undefined ? 0 : targetElement.offsetTop;
	const startPosition = window.pageYOffset;
	const distance = targetPosition - startPosition;
	let startTime = null;

	// Easing function (Ease In-Out Sine): Pergerakan lebih merata dari awal hingga akhir.
	function ease(t, b, c, d) {
		// t = timeElapsed, b = startPosition, c = distance, d = duration
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
			// PENTING: Jika waktu habis, pastikan posisi akhir sudah tepat.
			window.scrollTo(0, targetPosition);
		}
	}

	requestAnimationFrame(animation);
}

// ====================================================================
// FUNGSI INTERAKTIVITAS PETA (Tooltips & Redirection)
// ====================================================================
function setupMapInteractivity() {
	const mapContainer = document.getElementById("map-container");
	const tooltip = document.getElementById("tooltip");
	const imageContainer = document.getElementById("tooltip-image-container");
	const textContainer = document.getElementById("tooltip-text-container");

	if (!tooltip || !imageContainer || !textContainer || !mapContainer) {
		console.error(
			"Kesalahan Tooltip: Salah satu elemen peta/tooltip tidak ditemukan."
		);
		return;
	}
	const mapGroups = mapContainer.querySelectorAll("g[data-name]");

	const formatToSafeUrl = (name) => {
		return name.toLowerCase().replace(/\s+/g, "-");
	};

	mapGroups.forEach((groupElement) => {
		const regionName = groupElement.getAttribute("data-name");
		const imageUrl = groupElement.getAttribute("data-image");

		// --- 1. LOGIKA KLIK (Redirection) ---
		if (regionName) {
			const safeName = formatToSafeUrl(regionName);
			const targetUrl = `data/daerah${safeName}.html`;

			groupElement.addEventListener("click", (event) => {
				event.stopPropagation();
				window.location.href = targetUrl;
			});
			groupElement.style.cursor = "pointer";
		}

		// --- 2. LOGIKA HOVER/TOOLTIP ---
		groupElement.addEventListener("mouseenter", (event) => {
			textContainer.innerHTML = regionName
				? regionName.toUpperCase()
				: "NAMA DAERAH";

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

// ====================================================================
// LOGIKA UTAMA: DROPDOWN, SMOOTH SCROLL, SCROLL-TO-TOP (MERGED)
// ====================================================================
document.addEventListener("DOMContentLoaded", function () {
	// Panggil interaktivitas peta
	setupMapInteractivity();

	// --- KONFIGURASI SCROLL & THRESHOLD ---
	const SCROLL_THRESHOLD_DROPDOWN = 80; // Jarak scroll minimal agar dropdown tertutup
	const SCROLL_VISIBILITY_THRESHOLD = 300; // Jarak scroll agar tombol 'ke atas' muncul
	const SCROLL_DURATION_TOP = 600; // Durasi scroll ke atas (0.6 detik)
	const SCROLL_DURATION_NAV = 1000; // Durasi scroll navigasi (1.0 detik, sesuai permintaan)

	let initialScrollY = null;

	// Selektor
	const allDropdownItems = () =>
		document.querySelectorAll(".district-nav .dropdown-item");
	const activeDropdowns = () =>
		document.querySelectorAll(".district-nav .dropdown-item.active");
	const scrollToTopBtn = document.getElementById("scrollToTopBtn");

	function closeAllDropdowns() {
		if (activeDropdowns().length > 0) {
			activeDropdowns().forEach((item) => item.classList.remove("active"));
			initialScrollY = null;
		}
	}

	// A. SETUP & PENANGANAN KLIK TERPADU (FIX KONFLIK DROPDOWN)
	// Target SEMUA link di district-nav yang mengarah ke ID (#)
	document.querySelectorAll('.district-nav a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			// 1. LOGIKA DROPDOWN TOGGLE (Kabupaten/Kota)
			if (this.classList.contains("nav-dropdown-toggle")) {
				e.preventDefault();

				const parentLi = this.closest(".dropdown-item");

				// Tutup semua dropdown yang lain
				allDropdownItems().forEach((item) => {
					if (item !== parentLi) {
						item.classList.remove("active");
					}
				});

				// Buka/tutup dropdown saat ini
				parentLi.classList.toggle("active");

				// Set posisi scroll awal untuk threshold
				if (parentLi.classList.contains("active")) {
					initialScrollY = window.scrollY;
				} else {
					initialScrollY = null;
				}
			}

			// 2. LOGIKA SMOOTH SCROLL (Untuk Geografi, Ekonomi, dll.)
			else {
				e.preventDefault();
				const targetId = this.getAttribute("href");
				const targetElement = document.querySelector(targetId);

				if (targetElement) {
					smoothScroll(targetElement, SCROLL_DURATION_NAV);
				}
			}
		});
	});

	// B. LOGIKA TOMBOL SCROLL-TO-TOP
	if (scrollToTopBtn) {
		scrollToTopBtn.addEventListener("click", function () {
			// Target: document.body memiliki offsetTop = 0, yang akan scroll ke atas.
			smoothScroll(document.body, SCROLL_DURATION_TOP);
			closeAllDropdowns();
		});
	}

	// C. TUTUP DROPDOWN KARENA KLIK LUAR & SCROLL THRESHOLD
	document.addEventListener("click", function (event) {
		if (!event.target.closest(".dropdown-item")) {
			closeAllDropdowns();
		}
	});

	window.addEventListener("scroll", function () {
		// Logika 1: Menutup Dropdown
		if (activeDropdowns().length > 0 && initialScrollY !== null) {
			const currentScrollY = window.scrollY;
			const scrollDistance = Math.abs(currentScrollY - initialScrollY);

			if (scrollDistance > SCROLL_THRESHOLD_DROPDOWN) {
				closeAllDropdowns();
			}
		}

		// Logika 2: Menampilkan/Menyembunyikan Tombol Scroll-to-Top
		if (scrollToTopBtn) {
			if (window.pageYOffset > SCROLL_VISIBILITY_THRESHOLD) {
				scrollToTopBtn.classList.add("show");
			} else {
				scrollToTopBtn.classList.remove("show");
			}
		}
	});
});
