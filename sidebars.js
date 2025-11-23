/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Guide sidebar - Base-style flat structure with section headers
  guideSidebar: [
    // Home page
    {
      type: 'doc',
      id: 'home',
      label: 'Home',
    },

    // Introduction section
    {
      type: 'html',
      value: '<div class="sidebar-section-title">Introduction</div>',
      defaultStyle: true,
    },
    {
      type: 'doc',
      id: 'intro',
      label: 'iBnk',
    },
    'overview/long-term-vision',
    'overview/compliance',

    // General section
    {
      type: 'html',
      value: '<div class="sidebar-section-title">General</div>',
      defaultStyle: true,
    },
    'general/verified-settlement-endpoints',
    'general/environments',

    // Developer section
    {
      type: 'html',
      value: '<div class="sidebar-section-title">Developer</div>',
      defaultStyle: true,
    },
    'developer/api-integrations',

    // Infrastructure section
    {
      type: 'html',
      value: '<div class="sidebar-section-title">Infra & Usage</div>',
      defaultStyle: true,
    },
    'infrastructure/api-fees',
    'infrastructure/incentives-rewards',

    // Stablecoins section
    {
      type: 'html',
      value: '<div class="sidebar-section-title">Stablecoins</div>',
      defaultStyle: true,
    },
    'stablecoins/usdc',
    'stablecoins/audm',
    'stablecoins/audd',
    'stablecoins/cada',
    'stablecoins/xsgd',
    'stablecoins/gyen',
    'stablecoins/axcnh',
    'stablecoins/ngnc',
    'stablecoins/eurc',
    'stablecoins/gbpt',
  ],

  // API Reference sidebar - separate from guide
  apiSidebar: [
    {
      type: 'html',
      value: '<div class="sidebar-section-title">API Reference</div>',
      defaultStyle: true,
    },
    'api-reference/overview',
    'api-reference/quickstart',
    'api-reference/authentication',
    'api-reference/endpoints',
    'api-reference/transaction-signing',
    'api-reference/admin-api',
    'api-reference/reference',
  ],
};

module.exports = sidebars;
