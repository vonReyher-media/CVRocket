# 🚀 CVRocket – Developer-First Form Framework

CVRocket ist ein modularer, flexibler und performance-orientierter Form Builder für React – designt für Conversion-getriebene Use Cases wie Lead-Formulare, Onboardings, Funnels und interaktive Umfragen.

[![GitHub Stars](https://img.shields.io/github/stars/vonReyher-media/CVRocket?style=social)](https://github.com/vonReyher-media/CVRocket/stargazers)
[![NPM version](https://img.shields.io/npm/v/@vonreyher-media/cvrocket)](https://www.npmjs.com/package/@vonreyher-media/cvrocket)

---

## 🎯 Highlights

| Feature          | CVRocket                        |
| ---------------- | ------------------------------- |
| **TypeSafe**     | ✅ Zod-Schema Validierung       |
| **Responsive**   | ✅ Mobile-First Layouts         |
| **Event-driven** | ✅ Reaktive Analytics           |
| **Modular**      | ✅ Jede Seite einzeln steuerbar |
| **Headless**     | ✅ Volle UI-Kontrolle           |
| **Open Source**  | ✅ Apatche 2.0                  |

---

## 🔥 Why CVRocket?

| Feature                | CVRocket                        |
| ---------------------- | ------------------------------- |
| **Open Source**        | ✅ Fully MIT licensed           |
| **Customizable**       | ✅ Code-first, not config-first |
| **Headless / UI-free** | ✅ Use your own components      |
| **Analytics Ready**    | ✅ Event bus, event props       |
| **Mobile-First**       | ✅ Responsive by design         |
| **Zero Lock-in**       | ✅ No tracking, no vendor tie   |

CVRocket is the right choice if you want to:

- Build deeply customized forms and flows.
- Fully control UX, validation, and navigation.
- Track all steps, events, and data interactions.
- Own your data. Run your forms serverless, or in your own stack.

---

## 📦 Installation

```bash
npm i @vonreyher-media/cvrocket
pnpm add @vonreyher-media/cvrocket
```

### Peer Dependencies

Du musst folgende Peer Dependencies selbst installieren:

```bash
npm i react react-dom zod react-hook-form @hookform/resolvers @motionone/dom class-variance-authority clsx framer-motion lucide-react tailwind-merge
```

```bash
pnpm add react react-dom zod react-hook-form @hookform/resolvers @motionone/dom class-variance-authority clsx framer-motion lucide-react tailwind-merge
```

---

## 🔧 Quick Start

```tsx
import {
  CVRocketProvider,
  MultiSelectPage,
  OneSelectPage,
  UniversalFormPage,
  ThankYouClassic,
} from '@vonreyher-media/cvrocket';

function ExampleForm() {
  return (
    <CVRocketProvider
      onComplete={(data) => console.log(data)}
      persistData
      warnBeforeUnload
    >
      <MultiSelectPage datakey="symptoms" title="Wie fühlst du dich?" />
      <OneSelectPage datakey="goal" title="Dein Ziel?" />
      <UniversalFormPage
        datakey="profile"
        title="Über dich"
        zodSchema={yourZodSchema}
      >
        <UniversalInputField name="name" label="Name" />
      </UniversalFormPage>
      <ThankYouClassic title="Danke!" />
    </CVRocketProvider>
  );
}
```

---

## 🧠 Features

### 🧩 Page Types

- `EmptyPage`
- `MultiSelectPage`
- `OneSelectPage`
- `SliderSelectPage`
- `UniversalFormPage`
- `ThankYouClassic`, `ThankYouMinimal`, `ThankYouPersonal`

### 🧑‍💻 Developer-Fokus

- Komplett in **TypeScript**
- **Zod**-basierte Validierung
- Eigener **Event Bus** (`emit`, `subscribe`)
- **AGB Checkbox** optional pro Page
- **Persistente Speicherung** lokal
- **Auto-Next**, Button-Footer, Toast-System
- **Bedingtes Rendering** für dynamische Seiten

### 🔄 Bedingtes Rendering

CVRocket unterstützt bedingtes Rendering von Seiten basierend auf Formulardaten oder anderen Bedingungen:

```tsx
// Einfache Boolean-Bedingung
<PageTemplate renderCondition={someBooleanValue}>
  <YourContent />
</PageTemplate>

// Dynamische Bedingung mit Funktion
<PageTemplate
  renderCondition={() => {
    const { data } = useCVRocket();
    return data.someField === 'expectedValue';
  }}
>
  <YourContent />
</PageTemplate>
```

Die `renderCondition` Property kann entweder:

- Ein Boolean-Wert sein
- Eine Funktion, die einen Boolean zurückgibt
- Optional sein (Standard: `true`)

### 📊 Tracking Events

- `form_started`
- `form_completed`
- `form_error`
- `step_changed`
- `field_changed`
- `next_step`
- `previous_step`

---

## 🗂 Struktur

```
cvrocket/
├── apps/demo          # Vite-Demo
└── packages/core      # Hauptpaket (cvrocket)
    ├── components     # UI-Komponenten
    ├── pages          # Seitenbausteine
    ├── providers      # Context Provider
    ├── hooks          # Hilfsfunktionen
```

---

## 🧪 You want to test it first or create some PRs?

Checkout our Github Repo: [CVRocket](https://github.com/vonReyher-media/CVRocket)

## 🎯 Roadmap

- [ ] Mehrsprachigkeit (aktuell nur Deutsch)
- [ ] Neue Page-Templates & UI-Varianten
- [ ] Community-Template-Bibliothek
- [ ] Accessibility erweitern (Slider, ARIA, etc.)
- [ ] Routing zwischen Steps (tree/event-based)
- [ ] Toast-System konfigurierbar
- [ ] Versionierung von Persistenz-Daten

## 📄 Lizenz

**Apache 2.0** für private, interne oder akademische Nutzung.
Für kommerzielle SaaS-Nutzung mit Resale-Charakter kann eine Attribution oder kommerzielle Lizenz notwendig sein. Kontaktiere uns bei Fragen.

---

## 🌐 Website

📍 **Soon:** [cvrocket.vonreyher.media](https://cvrocket.vonreyher.media)

---

_Crafted with ❤️ by [@vonReyherMedia](https://github.com/vonReyherMedia)_
