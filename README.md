# iBnk API Documentation

API documentation system for iBnk decentralized exchange, built with Docusaurus and styled with Ionic Design System.

## Quick Start

### Install Dependencies

Dependencies are already installed. To reinstall if needed:

```bash
npm install
```

### Local Development

Start the local development server:

```bash
npm start
```

This will start the development server and open `http://localhost:3000` in your browser. Most changes will be reflected live without having to restart the server.

### Build

Generate static files for production:

```bash
npm run build
```

The built files will be generated in the `build` directory.

### Preview Build Locally

```bash
npm run serve
```

This will start a server at `http://localhost:3000` to preview the built content.

### Clear Cache

If you encounter build issues, clear the cache:

```bash
npm run clear
```

## Project Structure

```
.
├── blog/                   # Blog posts (Markdown)
├── docs/                   # Documentation pages (Markdown)
│   ├── overview/          # Overview documentation
│   ├── api-reference/     # API reference docs
│   └── infrastructure/    # Infrastructure docs
├── src/
│   ├── components/        # React components
│   ├── css/              # Global CSS (Ionic-inspired styles)
│   │   └── custom.css    # Custom styles with Tailwind blue-400 theme
│   ├── styles-ionic/     # Ionic Design System styles (SCSS)
│   │   └── custom.scss   # Main SCSS file with component imports
│   └── pages/            # Custom pages
│       └── index.js      # Homepage
├── static/               # Static assets
│   └── img/             # Image resources
├── docusaurus.config.js  # Docusaurus configuration
├── sidebars.js          # Sidebar configuration
└── package.json         # Project dependencies
```

## Theme Customization

This project uses a custom theme inspired by Ionic Design System with Tailwind CSS blue-400 (#60a5fa) as the primary color.

### Current Theme Colors

**Light Mode:**
- Primary: `#60a5fa` (Tailwind blue-400)
- Primary Dark: `#3b82f6` (Tailwind blue-500)
- Primary Darker: `#2563eb` (Tailwind blue-600)
- Primary Darkest: `#1d4ed8` (Tailwind blue-700)
- Primary Light: `#93c5fd` (Tailwind blue-300)
- Primary Lighter: `#bfdbfe` (Tailwind blue-200)
- Primary Lightest: `#dbeafe` (Tailwind blue-100)

**Dark Mode:**
- Uses the same color palette optimized for dark backgrounds

### Customizing Theme Colors

Edit `src/css/custom.css`:

```css
:root {
  --ifm-color-primary: #60a5fa;
  --ifm-color-primary-dark: #3b82f6;
  /* Modify other color variables */
}
```

For Ionic Design System color overrides, edit `src/styles-ionic/custom.scss`:

```scss
:root {
  --c-blue-90: #60a5fa;
  --c-blue-70: #60a5fa;
  /* Override other color tokens */
}
```

## Adding Documentation

### Create New Documentation Page

1. Create a new Markdown file in the `docs/` directory
2. Add frontmatter at the top of the file:

```markdown
---
sidebar_position: 2
title: Your Page Title
---

# Page Title

Your content here...
```

3. The document will automatically be added to the sidebar

### Organize Documentation Structure

Customize the sidebar structure in `sidebars.js`:

```javascript
const sidebars = {
  guideSidebar: [
    'overview/introduction',
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/authentication',
        'api-reference/endpoints',
      ],
    },
  ],
};
```

### Add Blog Posts

Create a new Markdown file in the `blog/` directory:

```markdown
---
slug: my-post
title: Post Title
authors: [admin]
tags: [tag1, tag2]
---

Post summary

<!-- truncate -->

Full post content...
```

## Configuration

### Modify Site Information

Edit the `docusaurus.config.js` file:

```javascript
const config = {
  title: 'iBnk',
  tagline: 'Decentralized Exchange API Documentation',
  url: 'https://your-domain.com',
  // ... other configurations
};
```

### Add Logo

1. Place your logo file (SVG format) in the `static/img/` directory
2. Configure in `docusaurus.config.js`:

```javascript
navbar: {
  logo: {
    alt: 'iBnk Logo',
    src: 'img/logo.svg',
    srcDark: 'img/logo.svg',
  },
}
```

### Search Configuration

The project is configured with Algolia DocSearch:

```javascript
algolia: {
  appId: 'GX6BVI45L3',
  apiKey: 'd4a3c603e75159478ce46ba620b134f7',
  indexName: 'ibnk',
}
```

## Deployment

### Deploy to GitHub Pages

1. Update `docusaurus.config.js` with your configuration:

```javascript
const config = {
  url: 'https://your-username.github.io',
  baseUrl: '/your-repo-name/',
  organizationName: 'your-username',
  projectName: 'your-repo-name',
};
```

2. Run the deploy command:

```bash
npm run deploy
```

### Deploy to Other Platforms

Build the project and deploy the `build` directory to:
- Vercel
- Netlify
- AWS S3
- Other static site hosting services

## Features

### Ionic Design System Integration

This project integrates the Ionic Design System for a modern, professional look:

- Custom SCSS components
- Ionic-inspired typography and spacing
- Smooth animations and transitions
- Mobile-responsive design

### SASS/SCSS Support

The project includes `docusaurus-plugin-sass` for SCSS compilation:

```javascript
plugins: ['docusaurus-plugin-sass'],
```

All SCSS files are compiled automatically during build.

### Modern Normalize

Uses `modern-normalize` for consistent cross-browser styling.

## Development Tips

### Live Reload

The development server supports hot module replacement (HMR). Changes to most files will be reflected immediately without refreshing the page.

### Component Development

React components can be placed in `src/components/` and imported throughout your documentation.

### Custom Pages

Create custom React pages in `src/pages/` for landing pages or special sections.

## Troubleshooting

### Port 3000 Already in Use

Kill the process using port 3000:

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Build Errors

1. Clear the cache: `npm run clear`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Check for any syntax errors in Markdown files

## Technology Stack

- **Docusaurus 3.9.2** - Modern static site generator
- **React 19.2.0** - UI library
- **Ionic Design System 8.0.0** - Design tokens and components
- **SASS 1.94.2** - CSS preprocessor
- **Modern Normalize 3.0.1** - CSS normalization

## Resources

- [Docusaurus Documentation](https://docusaurus.io/)
- [Ionic Design System](https://ionic.io/design-system)
- [Markdown Guide](https://www.markdownguide.org/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)

## License

ISC
