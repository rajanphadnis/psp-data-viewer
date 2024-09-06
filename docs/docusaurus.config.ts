import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
  title: "PSP Data Viewer | Docs",
  tagline: "imagine i actually documented it tho",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://psp-docs.rajanphadnis.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'facebook', // Usually your GitHub org/user name.
  // projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // path: "api",
          // routeBasePath: "api",
          // sidebarPath: './sidebarsProduct.js',
          editUrl:
            'https://github.dev/rajanphadnis/psp-data-viewer/blob/main/docs/',
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
      '@docusaurus/preset-classic',
      {
        gtag: {
          trackingID: 'G-67WSW9GJ33',
          anonymizeIP: false,
        },
      },
    ],
  ],
  
  themeConfig: {
    algolia: {
      // The application ID provided by Algolia
      appId: 'RJ36RG8K45',

      // Public API key: it is safe to commit it
      apiKey: '1eef2c1b924b6595a42a8aa98e2aee16',

      indexName: 'psp-rajanphadnis',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: 'external\\.com|domain\\.com',

      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      //replaceSearchResultPathname: {
      //  from: '/docs/', // or as RegExp: /\/docs\//
      //  to: '/',
      //},

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,

      //... other Algolia params
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    image: "img/liquids-logo.png",
    navbar: {
      // title: 'PSP Data Viewer',
      logo: {
        alt: "PSP Logo",
        src: "img/logo.svg",
      },
      items: [
        { to: "/architecture", label: "Architecture", position: "left" },
        {
          type: "docSidebar",
          sidebarId: "apiSidebar",
          position: "left",
          label: "API",
        },
        {
          type: "docSidebar",
          sidebarId: "webappSidebar",
          position: "left",
          label: "WebApp(s)",
        },
        {
          type: "docSidebar",
          sidebarId: "backendSidebar",
          position: "left",
          label: "Backend",
        },
        {
          href: "https://github.com/rajanphadnis/psp-data-viewer",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Architecture",
              to: "/architecture",
            },
            {
              label: "API",
              to: "/docs/api/intro",
            },
            
            {
              label: "WebApp(s)",
              to: "/docs/webapp/intro",
            },
            
            {
              label: "Backend",
              to: "/docs/backend/intro",
            },
          ],
        },
        {
          title: "Related Projects",
          items: [
            {
              label: "PSP Daq Parser",
              href: "https://github.com/rajanphadnis/daq_parser",
            },
          ],
        },
        {
          title: "More",
          items: [
            // {
            //   label: 'Blog',
            //   to: '/blog',
            // },
            {
              label: "GitHub",
              href: "https://github.com/rajanphadnis/psp-data-viewer",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Rajan Phadnis.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
