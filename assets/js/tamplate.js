document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
});













document.addEventListener("DOMContentLoaded", () => {
    // Ganti path relatif sesuai lokasi file HTML yang sedang dibuka
    loadTemplate("../../../../assets/tamplate/header.html", "header-container");
    loadTemplate("../../../../assets/tamplate/footer.html", "footer-container");
});

function loadTemplate(path, containerId) {
    const target = document.getElementById(containerId);
    if (!target) {
        console.log("Container tidak ditemukan:", containerId);
        return;
    }
    
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path);
    
    xhr.onload = () => {
        // status 200 = HTTP OK
        // status 0 = GitHub Pages tidak pakai (hanya local), tapi tetap kita anggap OK
        if (xhr.status === 200 || xhr.status === 0) {
            target.innerHTML = xhr.responseText;
        } else {
            console.error("Gagal load:", xhr.status, path);
        }
    };
    
    xhr.onerror = () => console.error("XHR error:", path);
    
    xhr.send();
}



document.addEventListener('DOMContentLoaded', function() {
    // 1. Ambil tombolnya, pastiin ID-nya udah bener ya, yaitu 'scrollToTopBtn'
    const scrollBtn = document.getElementById('scrollToTopBtn');

    // 2. Tambahkan 'event listener' buat dengerin kapan tombolnya di-klik
    scrollBtn.addEventListener('click', function() {
        // Pake window.scrollTo() untuk scroll ke koordinat (0, 0) alias awal page
        window.scrollTo({
            top: 0,
            left: 0,
            // Properti 'behavior: smooth' ini yang bikin gerakannya nggak jedak-jeduk
            behavior: 'smooth' 
        });
        
        // Catatan: Properti 'behavior: smooth' ini secara default 
        // punya durasi sekitar 300-500ms tergantung browser. 
        // Untuk mencapai *persis* 600ms, kita harus pakai 
        // requestAnimationFrame / fungsi transisi yang lebih kompleks, 
        // tapi cara di atas ini PALING MUDAH dan Cepat!
    });
});
