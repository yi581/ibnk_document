// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'iBnk',
  tagline: 'Decentralized Exchange API Documentation',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'your-org',
  projectName: 'your-project',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // i18n configuration
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // Serve docs at the site's root
          editUrl: 'https://github.com/your-org/your-project/tree/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/your-org/your-project/tree/main/',
        },
        theme: {
          customCss: [
            require.resolve('./node_modules/modern-normalize/modern-normalize.css'),
            require.resolve('./node_modules/@ionic-internal/ionic-ds/dist/tokens/tokens.css'),
            require.resolve('./src/styles-ionic/custom.scss'),
          ],
        },
      }),
    ],
  ],

  plugins: ['docusaurus-plugin-sass'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      algolia: {
        appId: 'GX6BVI45L3',
        apiKey: 'd4a3c603e75159478ce46ba620b134f7',
        indexName: 'ibnk',
      },
      navbar: {
        title: 'iBnk',
        hideOnScroll: true,
        logo: {
          alt: 'iBnk Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo.svg',
          href: '/',
          target: '_self',
          width: 139,
          height: 28,
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'guideSidebar',
            position: 'left',
            label: 'Get Started',
          },
          {
            type: 'docSidebar',
            sidebarId: 'apiSidebar',
            position: 'left',
            label: 'API Reference',
          },
          {
            to: '/blog',
            position: 'left',
            label: 'Blog',
          },
          {
            type: 'search',
            position: 'right',
          },
          {
            type: 'dropdown',
            label: 'Community',
            position: 'right',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/your-org/ibnk-protocol',
                target: '_blank',
                rel: null,
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/your-server',
                target: '_blank',
                rel: null,
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/ibnk_protocol',
                target: '_blank',
                rel: null,
              },
            ],
            className: 'navbar__link--community',
          },
          {
            type: 'dropdown',
            label: 'Support',
            position: 'right',
            items: [
              {
                label: 'Help Center',
                to: '/support',
                rel: null,
              },
              {
                label: 'Contact Us',
                href: 'mailto:support@ibnk.xyz',
                rel: null,
              },
            ],
            className: 'navbar__link--support',
          },
          {
            type: 'html',
            position: 'right',
            value: '<div class="separator" aria-hidden></div>',
          },
          {
            href: 'https://twitter.com/ibnk_protocol',
            position: 'right',
            className: 'icon-link icon-link-mask icon-link-twitter',
            'aria-label': 'Twitter',
            target: '_blank',
          },
          {
            href: 'https://discord.gg/your-server',
            position: 'right',
            className: 'icon-link icon-link-mask icon-link-discord',
            'aria-label': 'Discord',
            target: '_blank',
          },
          {
            href: 'https://github.com/your-org/ibnk-protocol',
            position: 'right',
            className: 'icon-link icon-link-mask icon-link-github',
            'aria-label': 'GitHub repository',
            target: '_blank',
          },
        ],
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
        additionalLanguages: ['bash', 'json', 'javascript', 'typescript'],
      },
    }),
};

module.exports = config;
