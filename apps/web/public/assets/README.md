# SwitchBook Static Image Guide

Place your custom images under `apps/web/public/assets/`.
Files in this folder are served from the web root (`/assets/...`).

## Folder Paths (already connected)

- `icons/`
  - `하우징.png`, `기판.png`, `보강판.png`, `축.png`, `키캡.png`, `기타.png` -> used in Landing menu category icons
  - `축.png` -> currently also connected as tab/apple icon placeholder
- `banners/home/`
  - `banner-01.png` ... `banner-04.png` -> Landing hero slideshow
- `og/`
  - `og-image.jpg` -> social share thumbnail (Open Graph)

## Recommended Sizes

- Favicon set
  - `favicon-16.png`: 16x16, PNG, transparent background recommended
  - `favicon-32.png`: 32x32, PNG, transparent background recommended
  - `apple-touch-icon.png`: 180x180, PNG
- Hero banner images (`banner-01.png` ... `banner-04.png`)
  - Recommended export: 1920x1080 (16:9) PNG/JPG/WebP
  - Minimum: 1600x900
  - File size target: <= 500 KB each (for faster first load)
- OG image (`og-image.jpg`)
  - Recommended: 1200x630 JPG (standard social preview ratio)
  - Keep key text/logo inside center safe area

## Notes

- If a hero image file is missing, the app temporarily falls back to the current default image URL.
- After replacing files, hard refresh browser (`Ctrl+F5`) to bypass cache.
