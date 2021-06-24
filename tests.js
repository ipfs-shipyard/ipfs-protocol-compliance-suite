/* global promise_test,assert_true,assert_equals,fetch,XMLHttpRequest,document */

promise_test(async (t) => {
  const element = document.createElement('img')

  element.src = URL_IPFS_IMAGE_FILE

  const onLoad = new Promise((resolve, reject) => {
    element.onload = resolve
    element.onerror = reject
  })

  // t.add_cleanup(async () => document.body.removeChild(element))

  document.body.appendChild(element)

  await onLoad

  assert_true(element.complete, 'Loaded content')
}, 'IPFS Image Tag')
promise_test(async () => {
  const element = document.createElement('video')

  element.src = URL_IPFS_VIDEO_FILE
  element.preload = 'auto'

  const onLoad = new Promise((resolve, reject) => {
    element.onloadeddata = resolve
    element.onerror = reject
  })

  // t.add_cleanup(async () => document.body.removeChild(element))

  document.body.appendChild(element)

  element.load()

  await onLoad

  assert_true(element.error === null, 'Loaded content')
}, 'IPFS Video Tag')
promise_test(async () => {
  const element = document.createElement('audio')

  element.src = URL_IPFS_AUDIO_FILE
  element.preload = 'auto'

  const onLoad = new Promise((resolve, reject) => {
    element.onloadeddata = resolve
    element.onerror = reject
  })

  // t.add_cleanup(async () => document.body.removeChild(element))

  document.body.appendChild(element)

  element.load()

  await onLoad

  assert_true(element.error === null, 'Loaded content')
}, 'IPFS Audio Tag')
promise_test(async () => {
  const element = document.createElement('iframe')

  element.src = URL_IPFS_HTML_FILE

  const onLoad = new Promise((resolve, reject) => {
    element.onload = resolve
    element.onerror = reject
  })

  // t.add_cleanup(async () => document.body.removeChild(element))

  document.body.appendChild(element)

  await onLoad

  assert_true(element.contentWindow !== null, 'Loaded content')

	// Code 18 is the cross origin error
  assert_throws_dom(18, () => element.contentWindow.location.href, 'Cross-origin protects frame')
}, 'IPFS Iframe Tag')
// promise_test(async () => {}, 'IPFS CSS Tag(`Style @import`)')
// promise_test(async () => {}, 'IPFS CSS Tag(Link)')
// promise_test(async () => {}, 'IPFS Script Tag')
// promise_test(async () => {}, 'IPFS Script Tag(module)')
// promise_test(async () => {}, 'IPFS Script `import`')
// promise_test(async () => {}, 'IPFS Script `import()`')
// promise_test(async () => {}, 'IPFS Script `Worker()`')
// promise_test(async () => {}, 'IPFS Script `ServiceWorker`')
// promise_test(async () => {}, 'IPFS Navigate via HREF')
promise_test(async () => {
  const xhr = new XMLHttpRequest()

  const onLoad = new Promise((resolve, reject) => {
    xhr.onload = resolve
    xhr.onerror = reject
  })

  xhr.open('get', URL_IPFS_TEXT_FILE)
  xhr.send()

  await onLoad

  assert_equals(xhr.status, 200, 'Response code OK')

  assert_equals(xhr.responseText, 'Hello World\n', 'Got expected text')
}, 'IPFS XHR Request')
promise_test(async () => {
  const response = await fetch(URL_IPFS_TEXT_FILE)

  assert_true(response.ok, 'Response is OK')

  const text = await response.text()

  assert_equals(text, 'Hello World\n', 'Got expected text')
}, 'IPFS Fetch Request')
