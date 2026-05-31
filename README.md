# Tailwind breakpoint indicator plugin

This Tailwind plugin displays a small screen size indicator:
![Screenshot with the plugin in use](https://github.com/stephtr/tailwind-breakpoint-indicator-plugin/raw/main/screenshot.png)

## Installation

```bash
npm install tailwind-breakpoint-indicator-plugin
```

## Quick Start

Just add the following to your `tailwind.config.js`:

```js
import breakpointIndicator from "tailwind-breakpoint-indicator-plugin";

export default {
  // ...
  plugins: [
    // ...
    breakpointIndicator,
  ],
};
```

## Credits

This plugin was inspired by a [Gist from Lelectrolux](https://gist.github.com/Lelectrolux/8f9a78491a5c9617078a73c091e01415)

## Changelog

### 0.3.0

- support for tailwind v4

### 0.2.0

- esm compatibility

### 0.1.0

- Initial release
