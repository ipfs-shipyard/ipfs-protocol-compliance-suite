# ipfs-protocol-compliance-suite
A set of HTML pages to test a browser's compliance with `ipfs://` and `ipns://` URLs.

Progress: https://github.com/ipfs/community/discussions/573

## How this works:

- Successor to [ipfs-protocol-handler-support-tests](https://github.com/ipfs/in-web-browsers/blob/master/docs/ipfs-protocol-handler-support-tests.html)
- Tests the browser's ability to handle IPFS URLS
- Using the [Web Platform Tests](https://github.com/web-platform-tests/wpt) repository to define tests
- Testing against a variety of file types and publishing methods (`ipfs://`, `ipns://`)
- Tests:
  - [x] `<img src>`
  - [x] `<video src>`
  - [x] `<audio src>`
  - [x] `<style>@import url()`
  - [x] `<link rel="stylesheet">`
  - [ ] `<a href>` navigation (can't simulate clicks)
  - [ ] `<object>` (hard to detect errors)
  - [x] `<iframe src>`
  - [x] `<script src>`
  - [x] `<script src type="module">`
  - [x] JS `import from`
  - [x] JS `await import()`
  - [ ] JS `new Worker()` (Getting errors with CORS)
  - [x] JS `navigator.serviceWorker.register` 
  - [ ] JS `window.location.href` navigation
  - [x] JS `XMLHttpRequest()`
  - [x] JS `fetch()`
  - [x] Generate directory listing for folders
  - [x] Render empty directories
  - [x] Resolve `index.html` in a path
  - [x] Resolve `NAME.html` for `/name/`
  - [ ] JS `fetch('ipfs://', {method: 'POST'})`
  - [ ] JS `fetch('ipns://', {method: 'POST'})`

## Publishing:

- Set up an IPFS node
- Make sure the `IPNS_DOMAIN` URL in `publish-files.js` is correct
- Run `publish-files.js`
- Pin the IPFS URL somewhere like Pinata
- Update the DNS domain to point to the IPFS URL using DNSLink
- Commit and push the changes (thus updating gh-pages)

## Prior Effort:


Supported Tests:

- Navigate to HREF CIDv0 - ipfs://qmbwqxbekc3p8tqskc98xmwnzrzdtrlmimpl8wbutgsmnr/
- Navigate to HREF CIDv1 - ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/
- Navigate to HREF with path (CIDv1) - ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/Vincent_van_Gogh.html#Style_and_works
- Navigate to HREF with IPNS and DNSLink hostname - ipns://en.wikipedia-on-ipfs.org/wiki/Vincent_van_Gogh.html#Style_and_works
- Origin isolation - should be considered it's own origin (how to test?) ipfs://bafkreifik2tbj5esf74sf2qwft2x3vuxaqmthwh3d2qx6abpcroirqpt7i/
- IMG loading: `<img src="ipfs://QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR" />`
- Video Loading: `<video src="ipfs://bafybeigwa5rlpq42cj3arbw27aprhjezhimhqkvhbb2kztjtdxyhjalr3q/big-buck-bunny_trailer.webm#t=5" >`
- XHR - ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
- Fetch - ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi

## Other Tests

Web Platform Tests: https://github.com/web-platform-tests/wpt

Should we reuse the test harness from there?

- [testharness.js](https://github.com/web-platform-tests/wpt/blob/master/resources/testharness.js)
- [testharness report](https://github.com/web-platform-tests/wpt/blob/master/resources/testharnessreport.js)
- [example test (custom element registry)](https://github.com/web-platform-tests/wpt/blob/master/custom-elements/custom-element-registry/define.html#L14)

Guide for writing tests: https://web-platform-tests.org/writing-tests/

## Logistics:

- Host as a Github Pages website to load over HTTP
- Set up a Pinata account (can this be replaced with an official IPFS account so the cost isn't stuck to Mauve?)
- Use separate build step to publish dependent content and generate a JS file for the main tests with IPFS hashes

## New effort

- Test one feature at a time with easy to read output
- Test all the same features as the old test
- Use CIDv1 and lower case hashes (browser URL compatability requirement)
- Test IPFS and IPNS URLs for every place, not just href
- Load JS via `<script>`, `<script type="module">` and `import`
- Load CSS via `@import` and `<link ="stylesheet">`
- Load a Worker script with `new Worker`
- Load a Service Worker with `navigator.serviceWorker.register`
- Load a `<iframe>`, iframe loads sub-resources via IPFS
- Load an `<audio>` file
- Load an `<object>`
- Intercept `ipfs://` requests in a serviceworker.
