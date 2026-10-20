# IDIE CRAFT DESAIN — Landing Page (Tailwind Edition)

Versi kedua dari landing page, dibangun dengan **Tailwind CSS**.
Tujuannya buat bandingin sama versi CSS murni di folder `LandingPageIDIE`.

---

## Struktur File

```
LandingPageIDIE2/
├── index.html              → markup + class Tailwind + config tema
├── README.md
└── assets/
    ├── css/
    │   └── custom.css       → PALET WARNA + bagian yang gak praktis di-Tailwind
    └── js/
        └── main.js          → interaksi (sama persis dengan versi 1)
```

---

## Cara Membuka

Klik dua kali `index.html`.

> **Penting:** versi ini pakai Tailwind Play CDN, jadi **butuh koneksi internet**
> saat dibuka. Versi 1 (`LandingPageIDIE`) jalan full offline.
> Kalau mau dipakai buat presentasi di kampus dan wifi dosen mati, pakai versi 1
> atau build Tailwind-nya (lihat bagian bawah).

---

## Ganti Warna — Cuma 1 Tempat

Warna tetap **tidak** ditulis di class Tailwind. Semua numpuk di satu blok:

```
assets/css/custom.css  →  paling atas, blok :root
```

```css
:root {
  --c-bg:        #0B0B0F;   /* latar utama */
  --c-surface:   #131319;   /* kartu */
  --c-surface-2: #1B1B23;   /* kartu hover */
  --c-text:      #F4F1EA;   /* teks utama */
  --c-muted:     #9A98A6;   /* teks sekunder */
  --c-line:      #26262F;   /* garis */
  --c-accent:    #D8C48A;   /* aksen utama */
  --c-accent-2:  #8F7BE8;   /* aksen kedua */
  --c-on-accent: #0B0B0F;   /* teks di atas aksen */
}
```

Ganti 9 baris itu → seluruh halaman ikut berubah. Tailwind-nya baca nilai
yang sama lewat `tailwind.config` di `index.html`:

```js
colors: {
  bg:       'var(--c-bg)',
  surface:  'var(--c-surface)',
  accent:   'var(--c-accent)',
  // ...
}
```

Jadi lo bisa nulis `bg-bg`, `text-ink`, `border-line`, `text-accent` di HTML,
dan warnanya tetap satu sumber.

Tersedia juga **OPSI B (Cream & Terracotta)** dan **OPSI C (Navy & Mint)**
sebagai blok komentar di file yang sama. Tinggal tukar.

---

## Yang Di-Tailwind vs Yang Di custom.css

Biar jelas pembagiannya:

| Pakai class Tailwind di HTML | Pakai custom.css |
|---|---|
| layout, grid, flex | orb blur di hero |
| padding, margin, gap | noise & grid overlay |
| ukuran teks, font weight | gradien teks hero |
| warna (lewat token var) | shadow tombol berwarna aksen |
| border radius, border | marquee animation |
| responsive (sm:, md:, lg:) | reveal on scroll |
| hover sederhana | tilt 3D showcase |
| | accordion FAQ (max-height) |
| | slider testimoni |

Semua yang butuh `color-mix()` atau animasi kompleks ditaruh di custom.css
supaya HTML-nya tetap enak dibaca.

---

## Perbandingan Jujur: Versi 1 vs Versi 2

| | **Versi 1 (CSS murni)** | **Versi 2 (Tailwind CDN)** |
|---|---|---|
| Jalan offline | Ya | Tidak |
| Ukuran CSS | 39 KB | ~24 KB + generator CDN (~100 KB saat runtime) |
| Ganti warna | 9 baris `:root` | 9 baris `:root` (sama) |
| Ubah layout | edit CSS, butuh paham selector | tambah/hapus class di HTML |
| Kecepatan eksperimen | sedang | cepat, tinggal tulis class |
| Baca kode di depan dosen | jelas, terstruktur | ramai, class panjang |
| Siap produksi | langsung | perlu build dulu |
| Nama class | harus mikir nama | gak perlu mikir nama |

Kesimpulan praktis:

- **mau utak-atik tampilan tiap 5 menit** → versi 2 menang
- **mau kirim zip ke dosen dan dijamin jalan di laptop apa pun** → versi 1 menang

---

## Naik ke Tailwind Build (Produksi)

Kalau versi 2 mau dipakai beneran (tanpa CDN, jalan offline, ringan):

```bash
# di folder LandingPageIDIE2
npm init -y
npm install -D tailwindcss@3

npx tailwindcss init
```

`tailwind.config.js`:

```js
module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        surface2: 'var(--c-surface-2)',
        ink: 'var(--c-text)',
        muted: 'var(--c-muted)',
        line: 'var(--c-line)',
        accent: 'var(--c-accent)',
        accent2: 'var(--c-accent-2)',
        onaccent: 'var(--c-on-accent)'
      },
      maxWidth: { page: '1180px' },
      borderRadius: { xl2: '18px', xl3: '28px' }
    }
  },
  plugins: []
};
```

`assets/css/input.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Build:

```bash
npx tailwindcss -i ./assets/css/input.css -o ./assets/css/tailwind.css --minify --watch
```

Lalu di `index.html`:

1. hapus `<script src="https://cdn.tailwindcss.com"></script>`
2. hapus blok `<script> tailwind.config = {...} </script>`
3. ganti dengan `<link rel="stylesheet" href="assets/css/tailwind.css">`

Selesai. Hasilnya CSS cuma ~15 KB, jalan offline, tanpa generator runtime.

---

## Yang Masih Dummy

Sama seperti versi 1:

- nomor WhatsApp `6281234567890`
- email & username Instagram/TikTok
- 6 kartu portofolio (masih inisial + gradien)
- teks testimoni

Cara ganti kartu portofolio jadi gambar asli:

```html
<div class="work-thumb">
  <img src="assets/img/kopi-senja.jpg" alt="Logo Kopi Senja">
</div>
```

CSS-nya sudah disiapkan di `custom.css` (`.work-thumb img`).
