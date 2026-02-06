frontend/
├── public/
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── apple-touch-icon.png
│   ├── fonts/
│   │   └── Cairo-VariableFont.woff2
│   └── manifest.json
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── auth/
│   │   │   │   └── page.tsx
│   │   │   ├── home/
│   │   │   │   └── page.tsx
│   │   │   ├── order/
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [orderId]/
│   │   │   │       └── page.tsx
│   │   │   ├── track/
│   │   │   │   └── page.tsx
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       ├── qr/
│   │   │       │   └── page.tsx
│   │   │       ├── orders/
│   │   │       │   └── page.tsx
│   │   │       ├── scan/
│   │   │       │   └── page.tsx
│   │   │       └── services/
│   │   │           └── page.tsx
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── auth/
│   │   │   └── OTPForm.tsx
│   │   ├── order/
│   │   │   ├── OrderWizard.tsx
│   │   │   ├── LocationPicker.tsx
│   │   │   ├── ServiceSelector.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── tracking/
│   │   │   ├── StatusTimeline.tsx
│   │   │   └── BagCard.tsx
│   │   ├── admin/
│   │   │   ├── QRGenerator.tsx
│   │   │   ├── BagScanner.tsx
│   │   │   ├── OrdersTable.tsx
│   │   │   └── StatusUpdater.tsx
│   │   └── shared/
│   │       ├── QRScanner.tsx
│   │       └── LoadingSpinner.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── bags.ts
│   │   │   ├── locations.ts
│   │   │   └── admin.ts
│   │   ├── store/
│   │   │   └── authStore.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useBags.ts
│   │   └── utils/
│   │       ├── format.ts
│   │       └── constants.ts
│   ├── messages/
│   │   ├── ar.json
│   │   └── en.json
│   ├── styles/
│   │   └── globals.css
│   └── middleware.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── Dockerfile
