# CVRocket 🚀

### The Developer-Centric Open Source Form Builder for High-Conversion Experiences

[![npm version](https://img.shields.io/npm/v/cvrocket.svg)](https://www.npmjs.com/package/cvrocket)
[![Downloads](https://img.shields.io/npm/dm/cvrocket.svg)](https://npm-stat.com/charts.html?package=cvrocket)
[![GitHub Stars](https://img.shields.io/github/stars/cvrocket/cvrocket.svg)](https://github.com/cvrocket/cvrocket/stargazers)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/cvrocket/cvrocket/pulls)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/cvrocket)](https://bundlephobia.com/package/cvrocket)

A React-powered alternative to Heyflow/Perspective/FunnelForms that combines enterprise-grade conversion optimization with full developer control.
We use MotionDome a tiny highly performant animation libary

## TODO

- [ ] Add more Languages for now all in German i18n would be appreciated or just being able to give a config for all error messages
- [ ] Add more Pages
- [ ] Add more Templates
- [ ] Toast add Config - to enable Styling disable and create custom Toasts / touch events
- [ ] Add Tree and Event based Routing
- [ ] Add Libary for all pages we have with examples and code snippets (comunity driven)
- [ ] Add even more Barierefreiheit than just aria-valuenow, aria-valuemin, aria-valuemax für Barrierefreiheit on the Slider page. (Check here browser APIS and aria attributes) - prs welcome
- [ ] fix the data persistence on the Slider page - for now it is not working as expected - also add versioning for the data - so we can use it in the future for the event tracking

## Why CVRocket? 🤔

<div align="center">

|                  | Commercial Platforms      | CVRocket                   |
| ---------------- | ------------------------- | -------------------------- |
| **Control**      | Limited customization     | Full code access ✨        |
| **Pricing**      | $$$ Monthly subscriptions | Free + self-hosted 🆓      |
| **Analytics**    | Basic metrics             | Raw event streaming 📊     |
| **Integrations** | Paid connectors           | Direct API access 🔌       |
| **Hosting**      | Vendor-locked             | Your infrastructure 🔐     |
| **Templates**    | Restricted access         | 6+ conversion-optimized 🎨 |
| **Bundle Size**  | Heavy runtime deps        | 12kb gzipped 📦            |

</div>

## Killer Features 💥

### 🚀 Conversion-Optimized Components

- Multi-step flows with progress indicators
- Mobile-first responsive design because most traffic is mobile
- Built-in error handling & validation
- 6+ pre-built templates (lead gen, surveys, onboarding)
- ( A/B testing framework ) → PRs welcome
- ( GDPR-ready data handling 🔒) → coming soon PRs welcome
- Navigation Protected - when the User uses the navigation Stack from the Browser.
- Uses Navigation API from the Browser to protect the Navigation

### ⚡ Developer Superpowers

- Type-safe forms with TypeScript support
- Customizable Pages for any use case
- Every Page has all the Data from the previous steps
- All Events on the Page are observable via Event Bus
- API-first architecture for seamless integration

### 🔌 Uses Standard Libraries

- Built on React, Zod
- Build with Tailwind CSS - for fast styling and customization
- No dependencies on heavy libraries like jQuery or Bootstrap
- Framer Motion for animations and transitions

### 🛠️ Architecture

To get started, you need to install the package and set up your first form. CVRocket is designed to be flexible and powerful, allowing you to create forms that fit your needs.

#### Create the Form Provider

The `CVRocketProvider` is the main component that wraps your application. It provides the context for all CVRocket Pages.
There are different Page templates but all of them are based on the `PageTemplate` component.

```tsx
import { CVRocketProvider } from 'cvrocket';

// 1. Create the Provider where the Pages will be rendered inside
function App() {
  return (
    <CVRocketProvider
      onComplete={(data) => {
        // Send to your CRM/API
        fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }}
      onError={(error) => {
        // Handle error
        console.error('Error:', error);
      }}
      onStart={() => {
        // Handle start
        console.log('Form started');
      }}
      onStepChange={(step) => {
        // Handle step change
        console.log('Step changed to:', step);
      }}
    >
      {/* Your Pages will be rendered here the Provider will handle conditional Rendering, progress and Buttons*/}
    </CVRocketProvider>
  );
}
```

### 📄 Page Templates

We have multiple Page templates to choose from, each designed for different use cases. The `PageTemplate` is the most flexible one, allowing you to create any kind of form.
Every Templates gets information for Validation the Fileds on the Page this is a simple
Zod schema that will be used to validate the fields on the page.

For now we have the Following Templates:

- `PageTemplate`: The most flexible one, allowing you to create any kind of form, all other templates are based on this one.
- `MultiSelectPageTemplate`: A multi-select page with auto rendered Cards for each option.
- `SelectPageTemplate`: A single-select page with auto rendered Cards for each option, the next Button will be not rendered and after selecting an option the next page will auto rendered.
- `FormPageTemplate`: A form page with auto rendered fields, you can define the fields via an Array. And for Validation a Zod schema.
- `SliderPageTemplate`: Just a slider with the options to select a value, or a min and max value.
- `EmptyPageTemplate`: Just a blank page, no validation, no buttons, no progress, but still gets all the data from the previous steps.
- More templates will be added in the future... - PR are welcome!

For every value the User Enters you can define a key—this will be the HTML name, in the JSON the Key and the value will be stored with that key.

### Examples for Each Template

Because all the templates are based on the `PageTemplate` you can use the PageTemplate props for all of them, but some of them have some extra props.

#### 1. Page Template

General Page Template with all the props

```tsx
// Import the Provider and the Page Template
import { PageTemplate, useCVRocket } from 'cvrocket';

// Get the data via the useCVRocket hook from the Provider
const { data } = useCVRocket();
// or
// get the data via the Provider if you are in the same File

// 1. Create type-safe forms with Page Templates
<PageTemplate
  onNext={() => console.log('Next')}
  onBack={() => console.log('Back')}
>
  <h1>Page Title</h1>
  <p>Page Description</p>
  // You can acces here all the data from the previous steps
  <p>Data from previous steps: {JSON.stringify(data)}</p>
</PageTemplate>;
```

### 🔥 Real-Time Event System

Track every interaction with our observable event bus:

```tsx
import { useCVRocket } from 'cvrocket';

const { emit } = useCVRocket();

// Emit custom events
const handleInputChange = (value) => {
  emit('field_changed', { field: 'email', value });
};

// Subscribe to events
useEffect(() => {
  const unsubscribe = subscribe('form_submitted', (data) => {
    console.log('Form submitted:', data);
  });
  return unsubscribe;
}, [subscribe]);
```

### 🎛️ Smart Navigation Control

Each page can control navigation buttons visibility:

```tsx
const MyPage = ({ setPageConfig }) => {
  useEffect(() => {
    setPageConfig({
      showNextButton: false, // Hide next button
      showBackButton: false, // Hide back button
      autoAdvance: true, // Auto-advance after 2 seconds
    });

    const timer = setTimeout(() => {
      emit('next_step');
    }, 2000);

    return () => clearTimeout(timer);
  }, [setPageConfig, emit]);

  return <div>Auto-advancing in 2 seconds...</div>;
};
```

### 🕹️ Page Configuration

Control navigation behavior per page:

```tsx
interface PageConfig {
  showNextButton?: boolean; // Show/hide next button
  showBackButton?: boolean; // Show/hide back button
  autoAdvance?: boolean | number; // Auto-advance after delay (ms)
  validateBeforeNext?: () => boolean; // Custom validation
}

// In your page component:
const { setPageConfig } = useCVRocket();

useEffect(() => {
  setPageConfig({
    showNextButton: true,
    validateBeforeNext: () => {
      return isValidEmail(data.email);
    },
  });
}, [data.email]);
```

### 🌐 Tracking-First Architecture

We aim to create the GA / GA4 / Mixpanel / Segment / Meta, Tiktok etc Pixel events for you, so you can track every interaction with our observable event bus. You can also use the `onComplete` and `onError` callbacks to send data to your analytics provider.
This is still a work in progress, but we are working on it.

For now you can use the `onComplete` and `onError` callbacks to send data to your analytics provider.
Here are PRs also welcome, please think about GPDR compliance, especially in Europe we want to integrate
directly into all Tag managers.

## Get Started in 60s ⏱️

1. Install package:

```bash
npm install cvrocket
# or
yarn add cvrocket
# or
pnpm add cvrocket
```

2. Create your first high-converting form:

```tsx
import { CVRocketProvider, MultiselectPage } from 'cvrocket';

function LeadForm() {
  return (
    <CVRocketProvider>
      <MultiselectPage
      //... all the Props the Component has
      />
    </CVRocketProvider>
  );
}
```

## Enterprise-Grade Integrations (coming Soon) 🧩

Connect to any stack with our plugin system with TypeScript into CRM, Validation APIs...

## Community Impact?!? 🌍

**?+ developers** trust CVRocket for their mission-critical forms:
We want to become the Standard for high conversion Forms for Ecom and Surveys

## Roadmap 🗺️

- [x] React Core (v1.0)
- [x] TypeScript Support (v1.2)
- [ ] More Pages (v2.0)
- [ ] Naive Pixel and Event Tracking (v2.1)
- [ ] React Native Integration (v3.0)

## Join the Rocket Crew 🚀

We welcome contributors of all levels! Here's how to get involved:

1. **First Time?** Start with our [Good First Issues](https://github.com/cvrocket/cvrocket/contribute)
2. **Core Devs** Join our [Weekly Office Hours](https://calendly.com/cvrocket/contributor-call)
3. **Community** Chat on [Discord](https://discord.gg/cvrocket)

```bash
# Development Setup
git clone https://github.com/vonReyherMedia/cvrocket.git
cd cvrocket
pnpm install
pnpm dev
```

## License 📄

This software is licensed under the Apache 2.0 License for individuals and internal commercial use only.
