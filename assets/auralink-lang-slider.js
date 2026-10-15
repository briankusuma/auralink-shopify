/**
 * AuraLink Language Switcher & Real-time Translation Engine
 * Figma Node 2655:276 / 2899:1097
 * Supports dynamic EN <-> ID switching, persistence, and comprehensive DOM translation across all pages.
 */

(function () {
  const STORAGE_KEY = 'auralink_locale';

  // Comprehensive Bilingual Dictionary (EN -> ID)
  const DICTIONARY = {
  "Enter store using password:": "Masuki toko dengan sandi:",
  "Enter using password": "Masuk dengan sandi",
  "Password": "Sandi",
  "Your password": "Sandi Anda",
  "Wrong password!": "Sandi salah!",
  "Enter": "Masuk",
  "Share on Facebook": "Bagikan di Facebook",
  "Share on X": "Bagikan di X",
  "Pin on Pinterest": "Pin di Pinterest",
  "Continue shopping": "Lanjutkan belanja",
  "Pagination": "Pembagian Halaman",
  "Next page": "Halaman berikutnya",
  "Previous page": "Halaman sebelumnya",
  "Search": "Cari",
  "Clear search term": "Hapus kata kunci pencarian",
  "View cart": "Lihat keranjang",
  "Item added to your cart": "Item ditambahkan ke keranjang Anda",
  "Close share": "Tutup bagikan",
  "Copy link": "Salin tautan",
  "Link": "Tautan",
  "Link copied to clipboard": "Tautan disalin ke clipboard",
  "of": "dari",
  "Slide right": "Geser kanan",
  "Slide left": "Geser kiri",
  "Thanks for subscribing": "Terima kasih sudah berlangganan",
  "Subscribe": "Berlangganan",
  "Skip to content": "Langsung ke konten",
  "Skip to product information": "Langsung ke informasi produk",
  "Close": "Tutup",
  "Error": "Kesalahan",
  "Choosing a selection results in a full page refresh.": "Jika memilih salah satu, seluruh halaman akan dimuat ulang.",
  "Opens in a new window.": "Membuka di jendela baru.",
  "Opens external website.": "Membuka situs web eksternal.",
  "Loading...": "Memuat...",
  "total reviews": "ulasan keseluruhan",
  "Collapsible content": "Konten yang dapat ditutup",
  "Complementary products": "Produk pelengkap",
  "Please note, comments need to be approved before they are published.": "Ingat, komentar perlu disetujui sebelum dipublikasikan.",
  "Leave a comment": "Tulis komentar",
  "Name": "Nama",
  "Comment": "Komentar",
  "Post comment": "Posting komentar",
  "Back to blog": "Kembali ke blog",
  "Share this article": "Bagikan artikel ini",
  "Your comment was posted successfully! Thank you!": "Komentar Anda berhasil diposting! Terima kasih!",
  "Your comment was posted successfully. We will publish it in a little while, as our blog is moderated.": "Komentar Anda berhasil diposting. Kami akan memublikasikannya sebentar lagi, blog kami sedang dimoderasi.",
  "Example product title": "Contoh judul produk",
  "Your collection's name": "Nama koleksi",
  "Add to cart": "Tambahkan ke keranjang",
  "Choose options": "Pilih opsi",
  "Description": "Deskripsi",
  "In stock": "Tersedia",
  "Low stock": "Stok sedikit",
  "Out of stock": "Stok habis",
  "Sale": "Diskon",
  "Product variants": "Varian produk",
  "Gallery Viewer": "Penampil Galeri",
  "Play 3D Viewer": "Putar Penampil 3D",
  "Play video": "Putar video",
  "Quantity": "Jumlah",
  "View quantity rules": "Lihat aturan kuantitas",
  "Volume Pricing": "Harga Volume",
  "Volume pricing available": "Harga volume tersedia",
  "View store information": "Lihat informasi toko",
  "Check availability at other stores": "Periksa ketersediaan di toko lainnya",
  "Pickup available": "Pengambilan tersedia",
  "Couldn't load pickup availability": "Tidak dapat memuat ketersediaan pengambilan",
  "Refresh": "Muat ulang",
  "Regular price": "Harga normal",
  "Sale price": "Harga promo",
  "Unit price": "Harga satuan",
  "Share this product": "Bagikan produk ini",
  "Sold out": "Habis",
  "Unavailable": "Tidak Tersedia",
  "Variant sold out or unavailable": "Varian terjual habis atau tidak tersedia",
  "View full details": "Lihat detail lengkap",
  "View in your space": "Lihat di lokasi Anda",
  "View in your space, loads item in augmented reality window": "Lihat di lokasi Anda, muat item di jendela realitas tertambah",
  "Taxes included.": "Termasuk pajak.",
  "Duties included.": "Termasuk bea cukai.",
  "Duties and taxes included.": "Termasuk bea cukai dan pajak.",
  "Media gallery": "Galeri media",
  "Match all": "Cocokkan semua",
  "Apply": "Terapkan",
  "Clear": "Hapus",
  "Remove all": "Hapus semua",
  "From": "Dari",
  "Filter and sort": "Filter dan urutkan",
  "Show more": "Selengkapnya",
  "Show less": "Sembunyikan lainnya",
  "Sort": "Urutkan",
  "Sort by:": "Urutkan:",
  "To": "Sampai",
  "Remove filter": "Hapus filter",
  "Page": "Halaman",
  "Products": "Produk",
  "Search results": "Hasil pencarian",
  "Suggestions": "Saran",
  "Pages": "Halaman",
  "Cart": "Keranjang",
  "Contact form": "Formulir kontak",
  "Phone number": "Nomor telepon",
  "Send": "Kirim",
  "Thanks for contacting us. We'll get back to you as soon as possible.": "Terima kasih telah menghubungi kami. Kami akan segera menghubungi Anda kembali.",
  "Please adjust the following:": "Mohon sesuaikan:",
  "Page not found": "Halaman tidak ditemukan",
  "Previous announcement": "Pengumuman sebelumnya",
  "Next announcement": "Pengumuman selanjutnya",
  "Announcement": "Pengumuman",
  "Announcement bar": "Bilah pengumuman",
  "Your cart": "Keranjang Anda",
  "Cart items": "Item di keranjang",
  "Estimated total": "Estimasi total",
  "New estimated total": "Estimasi total baru",
  "Order special instructions": "Instruksi khusus pesanan",
  "Your cart is empty": "Keranjang Anda kosong",
  "Product disclosure": "Pengungkapan produk",
  "Product disclosures": "Pengungkapan produk",
  "There was an error while updating your cart. Please try again.": "Terjadi kesalahan saat memperbarui keranjang. Silakan coba lagi.",
  "Duties and taxes included. Discounts and shipping calculated at checkout.": "Termasuk bea cukai dan pajak. Diskon dan biaya pengiriman dihitung saat checkout.",
  "Taxes included. Discounts and shipping calculated at checkout.": "Termasuk pajak. Diskon dan biaya pengiriman dihitung saat checkout.",
  "Duties included. Taxes, discounts and shipping calculated at checkout.": "Termasuk bea cukai. Pajak, diskon, dan biaya pengiriman dihitung saat checkout.",
  "Taxes, discounts and shipping calculated at checkout.": "Pajak, diskon, dan biaya pengiriman dihitung saat checkout.",
  "Product": "Produk",
  "Price": "Harga",
  "Product image": "Gambar produk",
  "Update": "Perbarui",
  "Have an account?": "Sudah punya akun?",
  "Payment methods": "Metode pembayaran",
  "View all": "Lihat semua",
  "Blog post": "Postingan blog",
  "Give your customers a summary of your blog post": "Berikan pelanggan ringkasan postingan blog Anda",
  "No products found": "Tidak ada produk yang ditemukan",
  "Collection": "Koleksi",
  "Load slide": "Muat slide",
  "Previous slide": "Slide sebelumnya",
  "Next slide": "Slide berikutnya",
  "Pause slideshow": "Jeda slideshow",
  "Play slideshow": "Putar slideshow",
  "Slide": "Geser",
  "Page title": "Judul halaman",
  "Product subtotal": "Subtotal produk",
  "Variant": "Varian",
  "Variant total": "Total varian",
  "Total items": "Total item",
  "Remove 1 item from your cart?": "Hapus 1 item dari keranjang Anda?",
  "Cancel": "Batal",
  "Country/region": "Negara/wilayah",
  "Language": "Bahasa",
  "Update language": "Perbarui bahasa",
  "Update country/region": "Perbarui negara/wilayah",
  "Popular countries/regions": "Negara/wilayah populer",
  "Account": "Akun",
  "Account details": "Detail akun",
  "View addresses": "Lihat alamat",
  "Return to Account details": "Kembali ke detail Akun",
  "Activate account": "Aktifkan akun",
  "Create your password to activate your account.": "Buat sandi untuk mengaktifkan akunmu.",
  "Confirm password": "Konfirmasi sandi",
  "Decline invitation": "Tolak undangan",
  "Addresses": "Alamat",
  "Add a new address": "Tambahkan alamat baru",
  "Edit address": "Edit alamat",
  "First name": "Nama depan",
  "Last name": "Nama belakang",
  "Company": "Perusahaan",
  "Address 1": "Alamat 1",
  "Address 2": "Alamat 2",
  "City": "Kota",
  "Province": "Provinsi",
  "Postal/ZIP code": "Kode pos",
  "Phone": "Telepon",
  "Set as default address": "Atur sebagai alamat default",
  "Add address": "Tambahkan alamat",
  "Update address": "Perbarui alamat",
  "Delete": "Hapus",
  "Are you sure you wish to delete this address?": "Yakin ingin menghapus alamat ini?",
  "Log in": "Masuk",
  "Log out": "Logout",
  "Create account": "Buat Akun",
  "Forgot your password?": "Lupa sandi?",
  "Continue": "Lanjutkan",
  "Continue as a guest": "Lanjutkan sebagai tamu",
  "Sign in": "Masuk",
  "Submit": "Kirim",
  "or": "atau",
  "Billing Address": "Alamat Penagihan",
  "Payment Status": "Status Pembayaran",
  "Shipping Address": "Alamat Pengiriman",
  "Fulfillment Status": "Status Pesanan",
  "Discount": "Diskon",
  "Shipping": "Pengiriman",
  "Tax": "Pajak",
  "Refunded": "Dana dikembalikan",
  "Track shipment": "Lacak pengiriman",
  "Tracking link": "Tautan pelacakan",
  "Carrier": "Kurir",
  "Tracking number": "Nomor pelacakan",
  "Duties": "Bea cukai",
  "Order history": "Riwayat pesanan",
  "Order": "Pesanan",
  "Date": "Tanggal",
  "Payment status": "Status pembayaran",
  "Fulfillment status": "Status pesanan",
  "You haven't placed any orders yet.": "Kamu belum membuat pesanan.",
  "Reset your password": "Reset sandi",
  "We will send you an email to reset your password": "Kami akan mengirimi Anda email untuk mereset sandi",
  "We've sent you an email with a link to update your password.": "Kami telah mengirimi Anda email berisi tautan untuk memperbarui sandi.",
  "Create": "Buat",
  "Reset account password": "Reset sandi akun",
  "Enter a new password": "Masukkan sandi baru",
  "Reset password": "Reset sandi",
  "Use the gift card code online or QR code in-store": "Gunakan kode voucher secara online atau kode QR di toko",
  "Your gift card": "Voucher Anda",
  "Gift card code": "Kode voucher",
  "Visit online store": "Kunjungi toko online",
  "Add to Apple Wallet": "Tambahkan ke Dompet Apple",
  "QR code — scan to redeem gift card": "Kode QR — pindai untuk menukarkan voucher",
  "Copy gift card code": "Salin kode voucher",
  "Code copied successfully": "Kode berhasil disalin",
  "Expired": "Kedaluwarsa",
  "I want to send this as a gift": "Saya ingin mengirim ini sebagai hadiah",
  "Gift card recipient form expanded": "Formulir penerima voucher dibuka",
  "Gift card recipient form collapsed": "Formulir penerima voucher ditutup",
  "Recipient email": "Email penerima",
  "Recipient email (optional)": "Email penerima (opsional)",
  "Recipient name (optional)": "Nama penerima (opsional)",
  "Message (optional)": "Pesan (opsional)",
  "Message": "Pesan",
  "YYYY-MM-DD": "TTTT-BB-HH",
  "Send on (optional)": "Kirim pada (opsional)",
  "Home": "Beranda",
  "Catalog": "Katalog",
  "Contact": "Kontak",
  "About": "Tentang",
  "Sign up": "Daftar",
  "Menu": "Menu",
  "Your Smart Home\nSafe - Seamless. and Secure": "Rumah Pintar Anda\nAman - Mulus. dan Terpercaya",
  "Your Smart Home\r\nSafe - Seamless. and Secure": "Rumah Pintar Anda\r\nAman - Mulus. dan Terpercaya",
  "Your Smart Home Safe - Seamless. and Secure": "Rumah Pintar Anda Aman - Mulus. dan Terpercaya",
  "Your Smart Home": "Rumah Pintar Anda",
  "Safe - Seamless. and Secure": "Aman - Mulus. dan Terpercaya",
  "Safe - Seamless. and Secure.": "Aman - Mulus. dan Terpercaya.",
  "Discover the latest smart home devices designed to simplify your life,  and optimize energy efficiency.": "Temukan perangkat rumah pintar terbaru yang dirancang untuk mempermudah hidup Anda, dan mengoptimalkan efisiensi energi.",
  "Discover the latest smart home devices designed to simplify your life, and optimize energy efficiency.": "Temukan perangkat rumah pintar terbaru yang dirancang untuk mempermudah hidup Anda, dan mengoptimalkan efisiensi energi.",
  "Get started": "Mulai sekarang",
  "Smart": "Pintar",
  "Safe": "Aman",
  "Secure": "Terpercaya",
  "Welcome to a Smarter Way of Living": "Selamat Datang di Cara Hidup yang Lebih Pintar",
  "Transforming everyday living": "Mentransformasi kehidupan sehari-hari",
  "AI devices learn your habits and adjust automatically.": "Perangkat AI mempelajari kebiasaan Anda dan menyesuaikan secara otomatis.",
  "Connected Ecosystem": "Ekosistem Terhubung",
  "Smart, Safe, and Secure": "Pintar, Aman, dan Terpercaya",
  "Seamless Integration with Your Life": "Integrasi Mulus dengan Kehidupan Anda",
  "Integration": "Integrasi",
  "Discover the latest smart home devices": "Temukan perangkat rumah pintar terbaru",
  "Transform your home with intelligent devices that learn, adapt, and respond": "Ubah rumah Anda dengan perangkat cerdas yang belajar, beradaptasi, dan merespons",
  "Lumi Glow": "Lumi Glow",
  "Smart Lights": "Lampu Pintar",
  "These AI-powered lights automatically adjust brightness and color temperature based on the time of day.": "Lampu bertenaga AI ini secara otomatis menyesuaikan kecerahan dan suhu warna berdasarkan waktu.",
  "Control Hub": "Pusat Kontrol",
  "Smart Hub": "Hub Pintar",
  "Intuitive central control unit engineered for high-precision tactile management of all your smart devices.": "Unit kontrol sentral intuitif yang dirancang untuk pengelolaan taktil berpresisi tinggi bagi semua perangkat pintar Anda.",
  "Docking Pad": "Dok Pengisi Daya",
  "Power & Charge": "Daya & Pengisian",
  "Seamless multi-device charging station crafted with architectural elegance and intelligent thermal regulation.": "Stasiun pengisian daya multi-perangkat yang dirancang dengan keanggunan arsitektural dan regulasi termal cerdas.",
  "View Product": "Lihat Produk",
  "“The integration of AI into smart home devices is revolutionizing how we interact with our living spaces. These technologies not only bring unprecedented convenience but also optimize energy use.”": "“Integrasi AI ke dalam perangkat rumah pintar merevolusi cara kita berinteraksi dengan ruang hidup kita. Teknologi ini tidak hanya menghadirkan kenyamanan luar biasa tetapi juga mengoptimalkan efisiensi energi.”",
  "The integration of AI into smart home devices is revolutionizing how we interact with our living spaces. These technologies not only bring unprecedented convenience but also optimize energy use.": "Integrasi AI ke dalam perangkat rumah pintar merevolusi cara kita berinteraksi dengan ruang hidup kita. Teknologi ini tidak hanya menghadirkan kenyamanan luar biasa tetapi juga mengoptimalkan efisiensi energi.",
  "Dr. Dayat Santoso": "Dr. Dayat Santoso",
  "CEO of NexaTech Innovations": "CEO NexaTech Innovations",
  "Product Launched over worldwide": "Produk Diluncurkan ke seluruh dunia",
  "Countries connected to our ecosystem": "Negara terhubung ke ekosistem kami",
  "raised in Series B funding": "dana terkumpul dalam pendanaan Seri B",
  "Here’s what people says": "Inilah Yang Orang Katakan",
  "Here's what people says": "Inilah Yang Orang Katakan",
  "Real stories from real homes—discover how our AI-powered devices are making everyday life smarter, safer, and more effortless.": "Kisah nyata dari rumah nyata—temukan bagaimana perangkat bertenaga AI kami membuat kehidupan sehari-hari lebih pintar, aman, dan mudah.",
  "Case study": "Studi kasus",
  "\"Security and comfort finally work together.\"": "\"Keamanan dan kenyamanan akhirnya berpadu.\"",
  "Security and comfort finally work together.": "Keamanan dan kenyamanan akhirnya berpadu.",
  "“With facial recognition and smart locks, I never worry about lost keys or unknown visitors. Plus, the whole system works with my voice assistant—it’s seamless and secure.”": "“Dengan pengenalan wajah dan kunci pintar, saya tidak pernah khawatir kehilangan kunci atau pengunjung tak dikenal. Ditambah lagi, seluruh sistem berfungsi dengan asisten suara saya—mulus dan aman.”",
  "With facial recognition and smart locks, I never worry about lost keys or unknown visitors. Plus, the whole system works with my voice assistant—it’s seamless and secure.": "Dengan pengenalan wajah dan kunci pintar, saya tidak pernah khawatir kehilangan kunci atau pengunjung tak dikenal. Ditambah lagi, seluruh sistem berfungsi dengan asisten suara saya—mulus dan aman.",
  "IT Consultant & Father of Two": "Konsultan TI & Ayah Dua Anak",
  "Comfort": "Kenyamanan",
  "\"Effortless energy savings without lifting a finger.\"": "\"Penghematan energi tanpa perlu repot.\"",
  "Effortless energy savings without lifting a finger.": "Penghematan energi tanpa perlu repot.",
  "“The climate sensors learned our daily routines in just a few days. Our heating bill dropped by nearly 30% while the house always stays at the perfect temperature.”": "“Sensor iklim mempelajari rutinitas harian kami hanya dalam beberapa hari. Tagihan pemanas kami turun hampir 30% sementara rumah selalu berada pada suhu sempurna.”",
  "The climate sensors learned our daily routines in just a few days. Our heating bill dropped by nearly 30% while the house always stays at the perfect temperature.": "Sensor iklim mempelajari rutinitas harian kami hanya dalam beberapa hari. Tagihan pemanas kami turun hampir 30% sementara rumah selalu berada pada suhu sempurna.",
  "Architect & Sustainability Director": "Arsitek & Direktur Keberlanjutan",
  "Energy": "Energi",
  "Climate": "Iklim",
  "\"Peace of mind wherever I travel.\"": "\"Ketenangan pikiran ke mana pun saya bepergian.\"",
  "Peace of mind wherever I travel.": "Ketenangan pikiran ke mana pun saya bepergian.",
  "“Being able to monitor the entire house in real time with end-to-end encryption gives our family genuine peace of mind. Everything connects without delays or bugs.”": "“Dapat memantau seluruh rumah secara real-time dengan enkripsi menyeluruh memberi keluarga kami ketenangan pikiran. Semuanya terhubung tanpa jeda atau kendala.”",
  "Being able to monitor the entire house in real time with end-to-end encryption gives our family genuine peace of mind. Everything connects without delays or bugs.": "Dapat memantau seluruh rumah secara real-time dengan enkripsi menyeluruh memberi keluarga kami ketenangan pikiran. Semuanya terhubung tanpa jeda atau kendala.",
  "Product Designer": "Desainer Produk",
  "Privacy": "Privasi",
  "Connected": "Terhubung",
  "\"Intuitive and elegant design for home\"": "\"Desain intuitif dan elegan untuk rumah\"",
  "Intuitive and elegant design for home": "Desain intuitif dan elegan untuk rumah",
  "“Even my grandparents find the tactile switches and automated lighting simple to use. The industrial design blends naturally into our interior aesthetics.”": "“Bahkan kakek-nenek saya merasa sakelar taktil dan pencahayaan otomatis sangat mudah digunakan. Desain industrial menyatu secara alami dengan estetika interior kami.”",
  "Even my grandparents find the tactile switches and automated lighting simple to use. The industrial design blends naturally into our interior aesthetics.": "Bahkan kakek-nenek saya merasa sakelar taktil dan pencahayaan otomatis sangat mudah digunakan. Desain industrial menyatu secara alami dengan estetika interior kami.",
  "Interior Stylist & Homeowner": "Penata Interior & Pemilik Rumah",
  "Intuitive": "Intuitif",
  "Aesthetic": "Estetika",
  "Your Journey to Smarter Living Starts with One Click.": "Perjalanan Anda Menuju Hidup Lebih Pintar Dimulai dengan Satu Klik.",
  "Discover AI-powered devices that adapt to your lifestyle—bringing comfort, security, and efficiency to every corner of your home.": "Temukan perangkat bertenaga AI yang menyesuaikan dengan gaya hidup Anda—menghadirkan kenyamanan, keamanan, dan efisiensi ke setiap sudut rumah Anda.",
  "AuraLink Ecosystem": "Ekosistem AuraLink",
  "Featured Devices": "Perangkat Pilihan",
  "Explore all devices": "Jelajahi semua perangkat",
  "Discover the latest intelligent devices engineered for seamless modern living.": "Temukan perangkat cerdas terbaru yang dirancang untuk kehidupan modern yang mulus.",
  "Explore our complete ecosystem of AI-powered smart home devices designed to seamlessly enhance your everyday living.": "Jelajahi ekosistem lengkap perangkat rumah pintar bertenaga AI kami yang dirancang untuk meningkatkan kehidupan sehari-hari Anda secara mulus.",
  "You may also like": "Anda mungkin juga menyukai",
  "Disclosures": "Informasi Tambahan",
  "Support & Inquiries": "Bantuan & Pertanyaan",
  "Have questions about AuraLink products or need assistance with your order? Our team is always ready to assist.": "Punya pertanyaan tentang produk AuraLink atau butuh bantuan dengan pesanan Anda? Tim kami selalu siap membantu.",
  "24/7 Response": "Respon 24/7",
  "Email Support": "Dukungan Email",
  "We answer within 24 hours.": "Kami menjawab dalam 24 jam.",
  "Mon - Fri": "Sen - Jum",
  "Live Assistance": "Bantuan Langsung",
  "9:00 AM – 6:00 PM EST": "09:00 – 18:00 EST",
  "Direct messaging with specialists.": "Pesan langsung dengan spesialis.",
  "Headquarters": "Kantor Pusat",
  "Global Office": "Kantor Global",
  "San Francisco, CA": "San Francisco, CA",
  "Worldwide delivery & support.": "Pengiriman & dukungan ke seluruh dunia.",
  "I accept the Terms and Privacy Policy.": "Saya menyetujui Syarat dan Kebijakan Privasi.",
  "Email": "Email",
  "Sent": "Terkirim",
  "Buy it now": "Beli sekarang",
  "Color": "Warna",
  "Size": "Ukuran",
  "Material": "Bahan",
  "Style": "Gaya",
  "Subtotal": "Subtotal",
  "Check out": "Checkout",
  "Checkout": "Checkout",
  "Search our store": "Cari di toko kami",
  "No results found": "Tidak ada hasil ditemukan",
  "Taxes and shipping calculated at checkout": "Pajak dan biaya pengiriman dihitung saat checkout",
  "Customer reviews": "Ulasan pelanggan",
  "Remove": "Hapus",
  "Collections": "Koleksi",
  "Filter:": "Filter:",
  "Availability": "Ketersediaan",
  "Featured": "Unggulan",
  "Best selling": "Paling laris",
  "Alphabetically, A-Z": "Secara alfabet, A-Z",
  "Alphabetically, Z-A": "Secara alfabet, Z-A",
  "Price, low to high": "Harga, rendah ke tinggi",
  "Price, high to low": "Harga, tinggi ke rendah",
  "Date, old to new": "Tanggal, lama ke baru",
  "Date, new to old": "Tanggal, baru ke lama",
  "Reset": "Atur ulang",
  "Clear all": "Hapus semua",
  "Usually ready in 24 hours": "Biasanya siap dalam 24 jam",
  "Share": "Bagikan",
  "Category": "Kategori",
  "Connect": "Terhubung",
  "Support": "Bantuan",
  "Quick links": "Tautan Cepat",
  "Subscribe to our emails": "Berlangganan email kami",
  "All rights reserved": "Semua hak dilindungi undang-undang",
  "Privacy policy": "Kebijakan privasi",
  "Terms of service": "Ketentuan layanan",
  "Refund policy": "Kebijakan pengembalian",
  "Shipping policy": "Kebijakan pengiriman",
  "Contact information": "Informasi kontak",
  "Opening soon": "Segera hadir"
};

  /**
   * Helper to normalize and translate text
   */
  function lookupTranslation(rawText) {
    if (!rawText || typeof rawText !== 'string') return null;
    const trimmed = rawText.trim();
    if (!trimmed) return null;

    // 1. Direct match
    if (DICTIONARY[trimmed]) return DICTIONARY[trimmed];

    // 2. Normalized whitespace
    const normSpaces = trimmed.replace(/\s+/g, ' ');
    if (DICTIONARY[normSpaces]) return DICTIONARY[normSpaces];

    // 3. Normalized quotes
    const normQuotes = trimmed.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    if (DICTIONARY[normQuotes]) return DICTIONARY[normQuotes];

    const fullNorm = normSpaces.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    if (DICTIONARY[fullNorm]) return DICTIONARY[fullNorm];

    // 4. Trailing punctuation & symbols
    // E.g. "Name *" or "Email *"
    if (trimmed.endsWith(' *')) {
      const base = trimmed.slice(0, -2);
      const trans = lookupTranslation(base);
      if (trans) return trans + ' *';
    }
    if (trimmed.endsWith('*') && !trimmed.endsWith(' *')) {
      const base = trimmed.slice(0, -1).trim();
      const trans = lookupTranslation(base);
      if (trans) return trans + ' *';
    }

    // E.g. "Availability:" or "Vendor:" or "Filter:"
    if (trimmed.endsWith(':')) {
      const base = trimmed.slice(0, -1);
      const trans = lookupTranslation(base);
      if (trans) return trans + ':';
    }

    // E.g. "View cart (2)"
    const cartCountMatch = trimmed.match(/^View cart\s*\(([^)]+)\)$/i);
    if (cartCountMatch) {
      return 'Lihat keranjang (' + cartCountMatch[1] + ')';
    }

    // E.g. "12 products" or "1 product"
    const countProdMatch = trimmed.match(/^(\d+)\s+products?$/i);
    if (countProdMatch) {
      return countProdMatch[1] + ' produk';
    }

    // E.g. "12 items" or "1 item"
    const countItemMatch = trimmed.match(/^(\d+)\s+items?$/i);
    if (countItemMatch) {
      return countItemMatch[1] + ' item';
    }

    // E.g. "12 reviews" or "1 review"
    const countReviewMatch = trimmed.match(/^(\d+)\s+reviews?$/i);
    if (countReviewMatch) {
      return countReviewMatch[1] + ' ulasan';
    }

    // E.g. "Page 1 of 5"
    const pageOfMatch = trimmed.match(/^Page\s+(\d+)\s+of\s+(\d+)$/i);
    if (pageOfMatch) {
      return 'Halaman ' + pageOfMatch[1] + ' dari ' + pageOfMatch[2];
    }

    // E.g. "Page 1"
    const pageMatch = trimmed.match(/^Page\s+(\d+)$/i);
    if (pageMatch) {
      return 'Halaman ' + pageMatch[1];
    }

    // E.g. "From $99.00"
    const fromMatch = trimmed.match(/^From\s+(\S.*)$/i);
    if (fromMatch) {
      return 'Dari ' + fromMatch[1];
    }

    // 5. Case-insensitive fallback lookup
    const lower = fullNorm.toLowerCase();
    for (const key of Object.keys(DICTIONARY)) {
      if (key.toLowerCase() === lower) {
        const val = DICTIONARY[key];
        if (trimmed === trimmed.toUpperCase() && trimmed !== trimmed.toLowerCase()) {
          return val.toUpperCase();
        }
        return val;
      }
    }

    return null;
  }

  /**
   * AuraLink Translator Singleton Controller
   */
  class TranslatorController {
    constructor() {
      this.currentLocale = 'en';
      this.isTranslating = false;
      this.observer = null;
      this.init();
    }

    init() {
      const savedLocale = localStorage.getItem(STORAGE_KEY);
      const docLang = document.documentElement.lang ? document.documentElement.lang.slice(0, 2).toLowerCase() : 'en';

      if (savedLocale === 'id' || (!savedLocale && docLang === 'id')) {
        this.currentLocale = 'id';
      } else {
        this.currentLocale = 'en';
      }

      this.updateButtons(this.currentLocale);

      if (this.currentLocale === 'id') {
        this.applyIndonesian();
      }

      this.setupObserver();
    }

    setupObserver() {
      if (this.observer || typeof MutationObserver === 'undefined') return;

      this.observer = new MutationObserver((mutations) => {
        if (this.currentLocale !== 'id' || this.isTranslating) return;

        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.translateElement(node);
            } else if (node.nodeType === Node.TEXT_NODE) {
              this.translateTextNode(node);
            }
          }
        }
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    setLocale(targetLocale) {
      if (!targetLocale) return;
      const normalized = targetLocale.slice(0, 2).toLowerCase();

      this.currentLocale = normalized;
      localStorage.setItem(STORAGE_KEY, normalized);
      document.documentElement.lang = normalized;

      this.updateButtons(normalized);

      if (normalized === 'id') {
        this.applyIndonesian();
      } else {
        this.restoreEnglish();
      }

      window.dispatchEvent(
        new CustomEvent('auralink:locale-changed', {
          detail: { locale: normalized }
        })
      );
    }

    updateButtons(locale) {
      const allButtons = document.querySelectorAll('.auralink-lang-btn');
      allButtons.forEach((btn) => {
        const btnLocale = (btn.dataset.locale || '').slice(0, 2).toLowerCase();
        if (btnLocale === locale) {
          btn.classList.add('auralink-lang-btn--active');
          btn.setAttribute('aria-checked', 'true');
        } else {
          btn.classList.remove('auralink-lang-btn--active');
          btn.setAttribute('aria-checked', 'false');
        }
      });

      document.querySelectorAll('input[name="locale_code"]').forEach((input) => {
        input.value = locale;
      });
    }

    applyIndonesian() {
      if (this.isTranslating) return;
      this.isTranslating = true;

      try {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode(node) {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              const tag = parent.tagName.toUpperCase();
              if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'].includes(tag)) {
                return NodeFilter.FILTER_REJECT;
              }
              if (parent.closest('.auralink-lang-slider') || parent.closest('svg')) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        let currentNode;
        while ((currentNode = walker.nextNode())) {
          this.translateTextNode(currentNode);
        }

        // Translate input placeholders & textareas
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((el) => {
          if (el.closest('.auralink-lang-slider')) return;
          if (el._auraOrigPlaceholder === undefined) {
            el._auraOrigPlaceholder = el.placeholder;
          }
          const translated = lookupTranslation(el._auraOrigPlaceholder);
          if (translated) {
            el.placeholder = translated;
          }
        });

        // Translate input buttons & submit inputs (value attribute)
        document.querySelectorAll('input[type="submit"], input[type="button"]').forEach((el) => {
          if (el.closest('.auralink-lang-slider')) return;
          if (el._auraOrigValue === undefined) {
            el._auraOrigValue = el.value;
          }
          const translated = lookupTranslation(el._auraOrigValue);
          if (translated) {
            el.value = translated;
          }
        });

        // Translate aria-label attributes
        document.querySelectorAll('[aria-label]').forEach((el) => {
          if (el.closest('.auralink-lang-slider')) return;
          if (el._auraOrigAriaLabel === undefined) {
            el._auraOrigAriaLabel = el.getAttribute('aria-label');
          }
          const translated = lookupTranslation(el._auraOrigAriaLabel);
          if (translated) {
            el.setAttribute('aria-label', translated);
          }
        });

        // Translate title attributes
        document.querySelectorAll('[title]').forEach((el) => {
          if (el.closest('.auralink-lang-slider')) return;
          if (el._auraOrigTitle === undefined) {
            el._auraOrigTitle = el.getAttribute('title');
          }
          const translated = lookupTranslation(el._auraOrigTitle);
          if (translated) {
            el.setAttribute('title', translated);
          }
        });
      } finally {
        this.isTranslating = false;
      }
    }

    translateTextNode(node) {
      if (!node || node.nodeType !== Node.TEXT_NODE) return;
      if (node.parentElement && (node.parentElement.closest('.auralink-lang-slider') || node.parentElement.closest('svg'))) {
        return;
      }

      if (node._auraOrigText === undefined) {
        node._auraOrigText = node.nodeValue;
      }

      const orig = node._auraOrigText;
      const translated = lookupTranslation(orig);

      if (translated) {
        const leadingWs = orig.match(/^\s*/)[0];
        const trailingWs = orig.match(/\s*$/)[0];
        node.nodeValue = leadingWs + translated + trailingWs;
      }
    }

    translateElement(rootEl) {
      if (!rootEl || rootEl.nodeType !== Node.ELEMENT_NODE) return;
      if (rootEl.closest && (rootEl.closest('.auralink-lang-slider') || rootEl.closest('svg'))) return;

      const walker = document.createTreeWalker(
        rootEl,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toUpperCase();
            if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'].includes(tag)) {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.closest('.auralink-lang-slider') || parent.closest('svg')) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let currentNode;
      while ((currentNode = walker.nextNode())) {
        this.translateTextNode(currentNode);
      }

      // Placeholders inside added element
      rootEl.querySelectorAll?.('input[placeholder], textarea[placeholder]').forEach((el) => {
        if (el._auraOrigPlaceholder === undefined) {
          el._auraOrigPlaceholder = el.placeholder;
        }
        const translated = lookupTranslation(el._auraOrigPlaceholder);
        if (translated) {
          el.placeholder = translated;
        }
      });

      // Value inside added element
      rootEl.querySelectorAll?.('input[type="submit"], input[type="button"]').forEach((el) => {
        if (el._auraOrigValue === undefined) {
          el._auraOrigValue = el.value;
        }
        const translated = lookupTranslation(el._auraOrigValue);
        if (translated) {
          el.value = translated;
        }
      });
    }

    restoreEnglish() {
      if (this.isTranslating) return;
      this.isTranslating = true;

      try {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode(node) {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              if (parent.closest('.auralink-lang-slider') || parent.closest('svg')) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        let currentNode;
        while ((currentNode = walker.nextNode())) {
          if (currentNode._auraOrigText !== undefined) {
            currentNode.nodeValue = currentNode._auraOrigText;
          }
        }

        // Restore placeholders
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((el) => {
          if (el._auraOrigPlaceholder !== undefined) {
            el.placeholder = el._auraOrigPlaceholder;
          }
        });

        // Restore input values
        document.querySelectorAll('input[type="submit"], input[type="button"]').forEach((el) => {
          if (el._auraOrigValue !== undefined) {
            el.value = el._auraOrigValue;
          }
        });

        // Restore aria-labels
        document.querySelectorAll('[aria-label]').forEach((el) => {
          if (el._auraOrigAriaLabel !== undefined) {
            el.setAttribute('aria-label', el._auraOrigAriaLabel);
          }
        });

        // Restore titles
        document.querySelectorAll('[title]').forEach((el) => {
          if (el._auraOrigTitle !== undefined) {
            el.setAttribute('title', el._auraOrigTitle);
          }
        });
      } finally {
        this.isTranslating = false;
      }
    }
  }

  // Instantiate or attach global controller
  window.AuraLinkTranslator = window.AuraLinkTranslator || new TranslatorController();

  // Web Component Registration
  if (!customElements.get('auralink-lang-slider')) {
    customElements.define(
      'auralink-lang-slider',
      class AuraLinkLangSlider extends HTMLElement {
        connectedCallback() {
          this.buttons = this.querySelectorAll('.auralink-lang-btn');
          this.form = this.querySelector('form');
          this.input = this.querySelector('input[name="locale_code"]');

          this.buttons.forEach((btn) => {
            btn.addEventListener('click', this.handleLangClick.bind(this));
          });

          if (window.AuraLinkTranslator) {
            window.AuraLinkTranslator.updateButtons(window.AuraLinkTranslator.currentLocale);
          }
        }

        handleLangClick(event) {
          event.preventDefault();
          const button = event.currentTarget;
          const targetLocale = button.dataset.locale;

          if (!targetLocale) return;

          if (window.AuraLinkTranslator) {
            window.AuraLinkTranslator.setLocale(targetLocale);
          }
        }
      }
    );
  }
})();
