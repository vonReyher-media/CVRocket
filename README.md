# CVRocket 🚀

### The Developer-Centric Open Source Form Builder for High-Conversion Experiences

[![GitHub Stars](https://img.shields.io/github/stars/vonReyher-media/CVRocket.svg?style=social)](https://github.com/vonReyher-media/CVRocket/stargazers)
[![Watchers](https://img.shields.io/github/watchers/vonReyher-media/CVRocket.svg?style=social)](https://github.com/vonReyher-media/CVRocket/watchers)
[![Forks](https://img.shields.io/github/forks/vonReyher-media/CVRocket.svg?style=social)](https://github.com/vonReyher-media/CVRocket/network/members)

CVRocket is a powerful, modular, developer-first form builder built with React. It's open-source, designed for conversion, and gives you complete control—ideal for high-impact use cases like lead generation, onboarding flows, product quizzes, and dynamic surveys.

We use **MotionDOM** for performance-optimized animations, and offer a full-blown event-driven architecture so you can track everything, react to anything, and style it however you want.

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

## 📦 Features

### ✅ Built-in Page Templates

- `EmptyPage`: For full control
- `MultiSelectPage`: Multi-choice pages with cards
- `OneSelectPage`: One-choice pages with auto-next
- `SliderSelectPage`: Range selection with animation
- `UniversalFormPage`: Schema-driven multi-field page
- `ThankYouClassic`: Classic closing screen

### 🧠 Developer First

- Written in TypeScript
- Zod validation support
- `CVRocketProvider` gives full state access
- Easily persist, reset, and track steps

### 🎯 Built-in Event System

- Use `useCVRocket().emit()` to fire events
- Use `useCVRocket().subscribe()` to observe them

Tracked Events:

- `form_started`
- `form_completed`
- `form_error`
- `step_changed`
- `field_changed`
- `next_step`
- `previous_step`

This gives you **real-time analytics** capabilities without vendor lock-in.

---

## ✨ Example Usage

How to add a custom font:
just add to you css the Variable `--font-brand: 'Your Font';`

````css

```tsx
import {
  CVRocketProvider,
  MultiSelectPage,
  OneSelectPage,
  UniversalFormPage,
  ThankYouClassic
} from 'cvrocket';

function MyForm() {
  return (
    <CVRocketProvider
      onComplete={(data) => console.log('Completed:', data)}
      onError={(e) => console.error('Error:', e)}
      onStart={() => console.log('Started')}
      onStepChange={(s) => console.log('Changed to step:', s)}
      persistData
      warnBeforeUnload
    >
      <MultiSelectPage datakey="symptoms" title="How do you feel?" />
      <OneSelectPage datakey="goal" title="Your goal?" />
      <UniversalFormPage datakey="profile" title="About you" />
      <ThankYouClassic />
    </CVRocketProvider>
  );
}
````

---

## 🛠️ Local Dev Setup

```bash
git clone https://github.com/vonReyherMedia/cvrocket.git
cd cvrocket
pnpm install
pnpm dev # Starts the demo app
```

This will spin up the example form inside the `apps/demo/` folder, using your local `packages/core/` version.

### Structure

```
cvrocket/
├── apps/
│   └── demo/         # Vite demo with full form usage
├── packages/
│   └── core/         # Core reusable library
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── providers/
│       │   └── hooks/
│       └── index.tsx
└── pnpm-workspace.yaml
```

### Build the library

```bash
pnpm build # from root or core dir
```

### Publish to npm

```bash
cd packages/core
npm version patch # or minor / major
npm publish --access public
```

Make sure the `package.json` has `"exports"` and `"types"` set correctly.

---

## 🧩 Planned Features

- [ ] Add more Languages – currently only German (i18n support and error message config)
- [ ] Add more Pages (new page types, variations)
- [ ] Add more Templates (with examples and previews)
- [ ] Toast config – enable/disable, support touch events, and add styling options
- [ ] Add tree- and event-based routing between pages
- [ ] Build a shared community-driven template library with examples/snippets
- [ ] Improve accessibility beyond basic ARIA roles – especially on SliderPage (e.g., use browser APIs, better keyboard support)
- [ ] Fix data persistence issues on SliderPage and introduce versioning for tracked data

We welcome feedback and discussion. Join the [Discord](https://discord.gg/cvrocket)!

---

## 🧑‍💻 Contributing

[![Open Issues](https://img.shields.io/github/issues/vonReyher-media/CVRocket)](https://github.com/vonReyher-media/CVRocket/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/vonReyher-media/CVRocket)](https://github.com/vonReyher-media/CVRocket/pulls)
[![Last Commit](https://img.shields.io/github/last-commit/vonReyher-media/CVRocket)](https://github.com/vonReyher-media/CVRocket/cvrocket)

We welcome contributors of all levels. You can help by:

- Fixing bugs or edge cases
- Writing new Page Templates
- Improving a11y support (ARIA, keyboard nav, etc)
- Adding integrations (e.g., HubSpot, Airtable, REST hooks)
- Helping translate or add error message localization

Start with:

```bash
pnpm install
pnpm dev
```

And open `apps/demo` to test your changes.

Submit your PRs with context and preview if possible 🙌

---

## 🌍 Website

Official website: [https://cvrocket.vonreyher.media](https://cvrocket.vonreyher.media) _(coming soon)_

---

## 📄 License

Licensed under the Apache 2.0 License — free for personal, academic, and internal commercial use.

External commercial use (e.g., SaaS builder reselling) may require attribution or extended license — contact us for details.

---

Crafted with React and Motion DOM and love by [@vonReyherMedia](https://github.com/vonReyherMedia).
