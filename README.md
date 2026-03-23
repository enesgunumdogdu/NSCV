# NSCV — JobTailor AI

Lokal calisan, ucretsiz, AI destekli CV optimizasyon araci. Is basvurularinda CV'ni ilana gore tailorlamak icin kullanilir.

- Tamamen lokal calisir, hicbir verini disari cikmaz
- Ollama ile ucretsiz AI (API key gerekmez)
- SQLite veritabani (kurulum gerektirmez)

## Gereksinimler

- **Node.js** 18+
- **Ollama** (lokal AI icin)

## Kurulum

```bash
# 1. Repoyu klonla
git clone https://github.com/kullaniciadin/NSCV.git
cd NSCV

# 2. Bagimliliklari yukle
npm install

# 3. Ollama'yi kur (kurulu degilse)
brew install ollama

# 4. AI modelini indir (~2GB, tek seferlik)
ollama pull llama3.2

# 5. Ollama sunucusunu baslat
ollama serve

# 6. Yeni bir terminalde projeyi baslat
npm run dev
```

Tarayicida **http://localhost:3000** adresini ac.

## Kullanim

### 1. CV Olustur

**Sol menu > CV'lerim**

Iki yol var:

- **+ Yeni CV** — Bos CV olusturup elle doldur
- **PDF Yukle** — Mevcut PDF ozgecmisini yukle, AI otomatik alanlari doldurur

CV 6 bolumden olusur:
- Kisisel Bilgiler (ad, email, telefon, LinkedIn, GitHub)
- Ozet
- Deneyim (bullet point'lerle)
- Egitim
- Projeler
- Yetenekler (kategori bazli)

Her bolumu bagimsiz olarak duzenleyebilirsin. Degisiklikleri kaydetmeyi unutma.

### 2. Is Ilani Ekle

**Sol menu > Is Ilanlari > + Yeni Ilan**

- Pozisyon adini ve sirket/ajans adini gir
- **Basvuru tipini sec:**
  - **Dogrudan Sirket** — Normal sirket basvurusu
  - **Outsource / IK Ajansi** — Randstad, Adecco gibi firmalar uzerinden yapilan basvurular
- Ilanin tam metnini yapistir
- Kaydet, sonra **"AI ile Analiz Et"** butonuna tikla

AI analiz sonucunda sunu gorursun:
- Gereken yetenekler
- Tercih edilen yetenekler
- ATS anahtar kelimeler
- Gizli beklentiler (satir aralarindan cikarilan)

### 3. CV'ni Tailorla

**Sol menu > Tailorla & Analiz Et**

- CV'ni ve is ilanini sec
- Iki secenek:
  - **Eksik Analizi** — CV'ndeki eksikleri gosterir (match score, eksik skill'ler, zayif bullet'lar)
  - **Otomatik Tailorla** — AI tum CV'ni ilana gore yeniden yazar

Outsource ilanlarda AI, sektore ve pozisyona odaklanir. Recruiter'in kolayca tarayabilecegi genel keyword'ler on plana cikar.

### 4. Versiyon Kaydet

Tailorlanmis CV'yi begenirsen **"Versiyon Olarak Kaydet"** ile kaydet.
Her basvuru icin ayri versiyon tutabilirsin.

## Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Next.js API Routes |
| Veritabani | SQLite (better-sqlite3) |
| AI | Ollama (llama3.2) |
| PDF Parse | pdf-parse |

## Yapilandirma

`.env.local` dosyasindan ayarlanabilir:

```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Farkli bir model kullanmak istersen:

```bash
ollama pull mistral
# .env.local icinde OLLAMA_MODEL=mistral yap
```

## Proje Yapisi

```
NSCV/
├── src/
│   ├── app/              # Sayfalar ve API route'lari
│   │   ├── cv/           # CV olusturma/duzenleme sayfasi
│   │   ├── jobs/         # Is ilani sayfasi
│   │   ├── tailor/       # Tailoring ve analiz sayfasi
│   │   └── api/          # Backend API'leri
│   ├── components/       # React bilesenler
│   │   ├── cv/           # CV editor bilesenler
│   │   ├── jobs/         # Ilan bilesenler
│   │   ├── tailor/       # Analiz/tailoring bilesenler
│   │   └── ui/           # Genel UI bilesenler
│   ├── lib/              # Cekirdek katman
│   │   ├── ai/           # AI istemci, prompt'lar, sema dogrulama
│   │   ├── types/        # TypeScript tip tanimlari
│   │   └── db.ts         # SQLite baglantisi
│   └── hooks/            # React hook'lari
├── scripts/              # Veritabani semasi
└── data/                 # SQLite DB dosyasi (gitignore'da)
```

## Lisans

MIT
