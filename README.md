# Yetric CMS

Simple markdown driven site with routing client-side only - [yetric/cms.js](https://github.com/yetric/cms.js)

**Goal: To be a developer-first-CMS that is crazy fast for users and site owners.**

## Features

-   Markdown Pages with Frontmatter Support
-   Generates RSS on deploy
-   Generates Sitemap.xml on deploy
-   Preconfigured for building and deploying on Netlify
-   Preconfigured for CircleCI
-   VanillaJS router and pushState management
-   Session cache on pages
-   Handles 404 by setting robots noindex
-   Add custom scripts (loaded relative to search or external) in frontmatter
-   Handle images in markdown
-   Native share functionality via navigator.share
-   Basic config via cms.json
-   Enable HTTP/2 Push for Webpack generated resources via \_\_headers file
-   Automatically turn some links into embed (Yotube WiP) (IntersectionObservers)

## TODO

-   Create NPM package
-   Custom Layouts
-   Create Specific Views for specific content types
-   Prefetch pages before clicking on link
-   Subscribe to RSS via Notifications (Firebase or OneSignal)
-   Cloud Functions implemented easily
-   Admin and Remote Config via Firebase
-   Genererate HTML pages on build
-   Generate Navigation on build
-   Sentry for errors
-   CLI for cms.js
-   **Plugin System**
    -   Similar Content
    -   Comments
    -   Login via Firebase
-   **Content Providers**
    -   Svelte Components
    -   React Components
    -   Vue Components
    -   Wordpress API
    -   RSS Feeds
    -   Firebase Firestore

## Contribute

Pull Requests are welcome! Fork the repo. For an easy start. Look at issues and start working on bugs or easier issues. Feel free to do a Pull Request for any item in the **TODO**-list.

## About

Built by [Yetric AB](https://yetric.com)
