
document.addEventListener("DOMContentLoaded", () => {
    loadTemplate("assets/tamplate/header.html", "header-container");
    loadTemplate("assets/tamplate/footer.html", "footer-container");
});

function loadTemplate(path, containerId) {
    const target = document.getElementById(containerId);
    if (!target) {
        console.log("Container tidak ditemukan:", containerId);
        return;
    }

    // Jika di GitHub Pages → prepend nama repo
    const repoName = "Jatimidia"; // GANTI INI
    const basePath = window.location.hostname.includes("github.io")
        ? `/${repoName}/${path}`
        : path;

    fetch(basePath)
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            return res.text();
        })
        .then(html => target.innerHTML = html)
        .catch(err => console.error("Gagal load:", err, basePath));
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
