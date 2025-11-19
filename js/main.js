// src/script/main.js

// Fungsi utama untuk mengatur interaktivitas peta (Klik dan Hover)
function setupMapInteractivity() {
    const mapContainer = document.getElementById('map-container');
    
    // KRITIS: Targetkan elemen <g> yang memiliki data-name karena ia adalah induk wilayah
    const mapGroups = mapContainer.querySelectorAll('g[data-name]');
    
    // Elemen Tooltip
    const tooltip = document.getElementById("tooltip");
    const imageContainer = document.getElementById("tooltip-image-container");
    const textContainer = document.getElementById("tooltip-text-container");
    
    // Fungsi utilitas untuk membersihkan nama daerah menjadi nama file yang aman (lowercase, spasi jadi strip)
    const formatToSafeUrl = (name) => {
        return name.toLowerCase().replace(/\s+/g, '-');
    };

    mapGroups.forEach(groupElement => {
        const regionName = groupElement.getAttribute("data-name");
        const imageUrl = groupElement.getAttribute("data-image");

        // --- 1. LOGIKA KLIK (Redirection) ---
        if (regionName) {
            const safeName = formatToSafeUrl(regionName);
            const targetUrl = `pages/kotakabupaten/${safeName}.html`; // Asumsi: folder 'pages/'

            groupElement.addEventListener('click', (event) => {
                event.stopPropagation(); // Mencegah konflik event
                
                // 💥 KRITIS: Melakukan redirect ke halaman baru
                window.location.href = targetUrl; 
            });

            // Set cursor pointer untuk semua grup yang memiliki data-name
            groupElement.style.cursor = 'pointer';
        }


        // --- 2. LOGIKA HOVER/TOOLTIP ---
        
        // Event ketika mouse masuk (mouseenter)
        groupElement.addEventListener("mouseenter", (event) => {
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
                imageContainer.style.backgroundColor = "#6c757d"; // Warna abu-abu fallback
            }

            // c. Tampilkan Tooltip
            tooltip.style.opacity = 1;

            // d. Tambahkan highlight pada elemen <g> (menggunakan CSS: g.hovered path)
            groupElement.classList.add("hovered");
        });

        // Event ketika mouse bergerak (mousemove)
        groupElement.addEventListener("mousemove", (event) => {
            // Posisikan tooltip
            tooltip.style.left = event.pageX + 15 + "px"; 
            tooltip.style.top = event.pageY - 15 + "px"; 
        });

        // Event ketika mouse keluar (mouseleave)
        groupElement.addEventListener("mouseleave", () => {
            // Sembunyikan tooltip
            tooltip.style.opacity = 0;

            // Hapus highlight
            groupElement.classList.remove("hovered");
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    // Panggil fungsi utama untuk mengaktifkan peta
    setupMapInteractivity(); 
    
    
    // --- 3. LOGIKA DROPDOWN DAN POPUP (Disimpan dari kode Anda sebelumnya) ---

    const kabupatenMenu = document.getElementById("kabupaten-menu");
    const kotaMenu = document.getElementById("kota-menu");
    const kabupatenPopup = document.getElementById("kabupaten-popup");

    // Fungsi untuk menutup semua dropdown dan popup
    function closeAll() {
        if (kabupatenMenu) kabupatenMenu.querySelector(".dropdown-content")?.classList.remove("active");
        if (kotaMenu) kotaMenu.querySelector(".dropdown-content")?.classList.remove("active");
        if (kabupatenPopup) kabupatenPopup.classList.remove("active");
    }

    // 1. Interaktivitas Menu Kabupaten di Header
    if (kabupatenMenu) {
        kabupatenMenu.addEventListener("click", (event) => {
            const dropdown = kabupatenMenu.querySelector(".dropdown-content");
            const isActive = dropdown?.classList.contains("active");

            // Tutup yang lain, buka yang ini
            closeAll();

            if (!isActive && dropdown) {
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
            event.stopPropagation();
        });
    }

    // 2. Interaktivitas Menu Kota di Header
    if (kotaMenu) {
        kotaMenu.addEventListener("click", (event) => {
            const dropdown = kotaMenu.querySelector(".dropdown-content");
            const isActive = dropdown?.classList.contains("active");

            // Tutup yang lain, buka yang ini
            closeAll();

            if (!isActive && dropdown) {
                dropdown.classList.add("active");
            }
            event.stopPropagation();
        });
    }

    // 3. Menutup dropdown/popup ketika mengklik di luar
    document.addEventListener("click", () => {
        closeAll();
    });
});