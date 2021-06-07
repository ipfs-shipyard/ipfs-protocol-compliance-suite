# ipfs-protocol-compliance-suite
A set of HTML pages to test a browser's compliance with `ipfs://` URLs.

Progress: https://github.com/ipfs/community/discussions/573

## Prior Effort:

[Link](https://github.com/ipfs/in-web-browsers/blob/master/docs/ipfs-protocol-handler-support-tests.html)

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
