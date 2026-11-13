# My Portfolio — Rifqi Permana Putra

Situs portofolio pribadi. Dibangun dari nol dengan HTML, CSS, dan JavaScript
tanpa framework maupun dependensi.

**Be Greater, Be Together**

---

## Halaman

| Berkas | Isi |
|---|---|
| `index.html` | Beranda — tentang saya, dua bidang fokus, istilah teknis, lima proyek, keahlian, profil |
| `proyek.html` | Rincian lima proyek: masalah, solusi, tumpukan teknologi, dan hasilnya |
| `perjalanan.html` | Linimasa pendidikan, kerja praktik, dan organisasi |
| `organisasi.html` | Dua periode di Divisi Kominfo HIMATIF UIR |
| `kontak.html` | Tautan kontak dan formulir |
| `404.html` | Halaman tidak ditemukan |

## Struktur

```
.
├── index.html
├── proyek.html
├── perjalanan.html
├── kontak.html
├── 404.html
└── assets/
    ├── css/
    │   ├── style.css      sistem desain, token warna, komponen beranda
    │   └── page.css       komponen khusus halaman anak
    ├── js/
    │   ├── sprite.js      ikon SVG, disuntikkan lewat JS
    │   └── main.js        loader, drawer, carousel, tab, scroll reveal, glitch
    └── img/               foto proyek dan tangkapan layar
```

## Catatan teknis

- **Tanpa dependensi.** Tidak ada build step, tidak ada `node_modules`. Berkas HTML
  bisa dibuka langsung maupun lewat server statis.
- **Token desain** ada di blok `:root` pada `style.css`. Mengganti palet cukup
  dari situ.
- **Sprite ikon** disuntikkan lewat JavaScript, bukan `fetch`, supaya tetap
  bekerja saat berkas dibuka langsung dari `file://`.
- **Cache-busting** memakai parameter `?v=` pada URL aset. Naikkan angkanya
  setiap kali CSS atau JS diubah.
- **`prefers-reduced-motion`** dihormati — seluruh animasi, termasuk glitch dan
  ornamen berputar, dimatikan bagi yang memerlukannya.

## Menjalankan secara lokal

```bash
python -m http.server 5173
```

Lalu buka `http://localhost:5173`.

## Kontak

- Email — rifqipermanaputra358@gmail.com
- GitHub — [RifqiPermanaPutra](https://github.com/RifqiPermanaPutra)
- LinkedIn — [rifqi-permana-putra](https://www.linkedin.com/in/rifqi-permana-putra-9563072a1/)
