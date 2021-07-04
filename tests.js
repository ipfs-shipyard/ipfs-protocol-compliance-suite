/* global
promise_test,
assert_true,
assert_equals,
assert_throws_dom,
fetch,
XMLHttpRequest,
document,
Worker
URL_IPFS_IMAGE_FILE,
URL_IPFS_VIDEO_FILE,
URL_IPFS_AUDIO_FILE,
URL_IPFS_HTML_FILE,
URL_IPFS_TEXT_FILE,
URL_IPFS_CSS_FILE,
URL_IPFS_JS_FILE,
URL_IPFS_JS_FILE_IMPORT,
URL_IPFS_JS_FILE_IMPORT_DYNAMIC,
*/

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
promise_test(async () => {
  // TODO: Doesn't look like parsing errors are properly reported. :/
  const element = document.createElement('style')

  element.appendChild(document.createTextNode(`@import url("${URL_IPFS_CSS_FILE}")`))

  const onLoad = new Promise((resolve, reject) => {
    element.onload = resolve
    element.onerror = reject
  })

  // t.add_cleanup(async () => document.body.removeChild(element))

  document.body.appendChild(element)

  await onLoad
}, 'IPFS CSS Tag(`Style @import`)')
promise_test(async () => {
  const element = document.createElement('link')

  element.rel = 'stylesheet'
  element.href = URL_IPFS_CSS_FILE

  const onLoad = new Promise((resolve, reject) => {
    element.onload = resolve
    element.onerror = reject
  })

  // t.add_cleanup(async () => document.body.removeChild(element))

  document.body.appendChild(element)

  await onLoad
}, 'IPFS CSS Tag(Link)')
promise_test(async () => {
  const element = document.createElement('script')

  element.src = URL_IPFS_JS_FILE

  const onLoad = new Promise((resolve, reject) => {
    element.onload = resolve
    element.onerror = reject
  })

  // t.add_cleanup(async () => document.body.removeChild(element))

  document.body.appendChild(element)

  await onLoad

  assert_true(true, 'Loaded content')
}, 'IPFS Script Tag')
promise_test(async () => {
  const element = document.createElement('script')

  element.src = URL_IPFS_JS_FILE
  element.type = 'module'

  const onLoad = new Promise((resolve, reject) => {
    element.onload = resolve
    element.onerror = reject
  })

  // t.add_cleanup(async () => document.body.removeChild(element))

  document.body.appendChild(element)

  await onLoad

  assert_true(true, 'Loaded content')
}, 'IPFS Script Tag(module)')
promise_test(async () => {
  const element = document.createElement('script')

  element.src = URL_IPFS_JS_FILE_IMPORT
  element.type = 'module'

  const onLoad = new Promise((resolve, reject) => {
    element.onload = resolve
    element.onerror = reject
  })

  // t.add_cleanup(async () => document.body.removeChild(element))

  document.body.appendChild(element)

  await onLoad

  assert_true(true, 'Loaded content')
}, 'IPFS Script `import`')
promise_test(async () => {
  const element = document.createElement('script')

  element.src = URL_IPFS_JS_FILE_IMPORT_DYNAMIC
  element.type = 'module'

  const onLoad = new Promise((resolve, reject) => {
    element.onload = resolve
    element.onerror = reject
  })

  // t.add_cleanup(async () => document.body.removeChild(element))

  document.body.appendChild(element)

  await onLoad

  assert_true(true, 'Loaded content')
}, 'IPFS Script `import()`')
promise_test(async () => {
  const worker = new Worker(URL_IPFS_JS_FILE)

  const onLoad = new Promise((resolve, reject) => {
    worker.onmessage = resolve
    worker.onerror = reject
  })

  const message = await onLoad

  assert_true(message.example, 'Got example message from worker')
}, 'IPFS Script `Worker()`')
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
