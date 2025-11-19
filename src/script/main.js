// 1. Ambil semua elemen
const paths = document.querySelectorAll("#map-container path"); // Target path di dalam SVG
const tooltip = document.getElementById("tooltip");
const imageContainer = document.getElementById("tooltip-image-container");
const textContainer = document.getElementById("tooltip-text-container");

paths.forEach((path) => {
	// Dapatkan data dari <g> terdekat
	const closestGroup = path.closest("g");

	const regionName = closestGroup
		? closestGroup.getAttribute("data-name")
		: path.getAttribute("data-name");
	const imageUrl = closestGroup
		? closestGroup.getAttribute("data-image")
		: path.getAttribute("data-image");

	// 2. Event ketika mouse masuk (mouseenter)
	path.addEventListener("mouseenter", (event) => {
		// a. Isi Teks
		textContainer.innerHTML = regionName
			? regionName.toUpperCase()
			: "NAMA DAERAH";

		// b. Isi Gambar
		if (imageUrl) {
			imageContainer.style.backgroundImage = `url('${imageUrl}')`;
			imageContainer.style.backgroundColor = "transparent";
		} else {
			imageContainer.style.backgroundImage = "none";
			imageContainer.style.backgroundColor = "#6c757d"; // Warna abu-abu jika gambar tidak ada
		}

		// c. Tampilkan Tooltip
		tooltip.style.opacity = 1;

		// d. Tambahkan highlight
		path.classList.add("hovered");
	});

	// 3. Event ketika mouse bergerak (mousemove)
	path.addEventListener("mousemove", (event) => {
		// Posisikan tooltip
		tooltip.style.left = event.pageX + 15 + "px";
		tooltip.style.top = event.pageY - 15 + "px";
	});

	// 4. Event ketika mouse keluar (mouseleave)
	path.addEventListener("mouseleave", () => {
		// Sembunyikan tooltip
		tooltip.style.opacity = 0;

		// Hapus highlight
		path.classList.remove("hovered");
	});
});

document.addEventListener("DOMContentLoaded", () => {
	const kabupatenMenu = document.getElementById("kabupaten-menu");
	const kotaMenu = document.getElementById("kota-menu");
	const kabupatenPopup = document.getElementById("kabupaten-popup");

	// Fungsi untuk menutup semua dropdown dan popup
	function closeAll() {
		kabupatenMenu.querySelector(".dropdown-content").classList.remove("active");
		kotaMenu.querySelector(".dropdown-content").classList.remove("active");
		kabupatenPopup.classList.remove("active");
	}

	// 1. Interaktivitas Menu Kabupaten di Header
	kabupatenMenu.addEventListener("click", (event) => {
		const dropdown = kabupatenMenu.querySelector(".dropdown-content");
		const isActive = dropdown.classList.contains("active");

		// Tutup yang lain, buka yang ini
		closeAll();

		if (!isActive) {
			dropdown.classList.add("active");

			// Tampilkan popup di atas peta (sesuai data-target)
			const targetId = dropdown.getAttribute("data-target");
			if (targetId) {
				const targetPopup = document.getElementById(targetId);
				if (targetPopup) {
					targetPopup.classList.add("active");
				}
			}
		}
		event.stopPropagation(); // Mencegah klik di dalam menu dari menutup menu
	});

	// 2. Interaktivitas Menu Kota di Header
	kotaMenu.addEventListener("click", (event) => {
		const dropdown = kotaMenu.querySelector(".dropdown-content");
		const isActive = dropdown.classList.contains("active");

		// Tutup yang lain, buka yang ini
		closeAll();

		if (!isActive) {
			dropdown.classList.add("active");
		}
		event.stopPropagation();
	});

	// 3. Menutup dropdown/popup ketika mengklik di luar
	document.addEventListener("click", () => {
		closeAll();
	});
});
