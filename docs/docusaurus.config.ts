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
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  
  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    image: "img/docusaurus-social-card.jpg",
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
