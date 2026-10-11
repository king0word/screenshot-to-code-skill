# Stack-specific CDN tags

Copy these tags verbatim. They encode hard-won fixes (version pins that avoid
breaking in-browser transforms, mirror availability) — do not "modernize" them.

## html_tailwind (default)

```html
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
```

## React (standalone page)

```html
<script src="https://cdn.jsdelivr.net/npm/react@18.0.0/umd/react.development.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18.0.0/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.25.6/babel.min.js"></script>
<script src="https://cdn.tailwindcss.com"></script>
```

Pin Babel to exactly `7.25.6` — the unversioned URL now resolves to Babel 8,
whose automatic JSX runtime injects an `import` that breaks in-browser
transforms. Never use `https://cdn.babeljs.io/babel.min.js`.

## Vue (standalone page)

```html
<script src="https://registry.npmmirror.com/vue/3.3.11/files/dist/vue.global.js"></script>
<script src="https://cdn.tailwindcss.com"></script>
```

Use the global build:

```html
<div id="app">{{ message }}</div>
<script>
  const { createApp, ref } = Vue
  createApp({
    setup() {
      const message = ref('Hello vue!')
      return { message }
    }
  }).mount('#app')
</script>
```

## Bootstrap

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
```

## html_css (plain)

No Tailwind, no frameworks — handwritten CSS only.

## All stacks

- Google Fonts or other publicly accessible fonts are allowed.
- Icons via Font Awesome (tag above), except when the stack ships its own
  icon set.
