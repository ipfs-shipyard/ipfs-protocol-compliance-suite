/* global
promise_test,
assert_true,
assert_equals,
assert_throws_dom,
fetch,
XMLHttpRequest,
document,
Worker */

import * as CONSTANTS from './constants.js'

function makePermutations (suffix) {
  return [`URL_IPFS_${suffix}`, `URL_IPFS_${suffix}_RAW`, `URL_IPNS_${suffix}`]
}

for (const urlKey of makePermutations('IMAGE_FILE')) {
  promise_test(async (t) => {
    const element = document.createElement('img')

    element.src = CONSTANTS[urlKey]

    const onLoad = new Promise((resolve, reject) => {
      element.onload = resolve
      element.onerror = reject
    })

    // Comment out to debug
    t.add_cleanup(async () => document.body.removeChild(element))

    document.body.appendChild(element)

    await onLoad

    assert_true(element.complete, 'Loaded content')
  }, `IPFS Image Tag - ${urlKey}`)
}

for (const urlKey of makePermutations('VIDEO_FILE')) {
  promise_test(async (t) => {
    const element = document.createElement('video')

    element.src = CONSTANTS[urlKey]
    element.preload = 'auto'

    const onLoad = new Promise((resolve, reject) => {
      element.onloadeddata = resolve
      element.onerror = reject
    })

    // Comment out to debug
    t.add_cleanup(async () => document.body.removeChild(element))

    document.body.appendChild(element)

    element.load()

    await onLoad

    assert_true(element.error === null, 'Loaded content')
  }, `IPFS Video Tag - ${urlKey}`)
}

for (const urlKey of makePermutations('AUDIO_FILE')) {
  promise_test(async (t) => {
    const element = document.createElement('audio')

    element.src = CONSTANTS.URL_IPFS_AUDIO_FILE
    element.preload = 'auto'

    const onLoad = new Promise((resolve, reject) => {
      element.onloadeddata = resolve
      element.onerror = reject
    })

    // Comment out to debug
    t.add_cleanup(async () => document.body.removeChild(element))

    document.body.appendChild(element)

    element.load()

    await onLoad

    assert_true(element.error === null, 'Loaded content')
  }, `IPFS Audio Tag - ${urlKey}`)
}

for (const urlKey of makePermutations('CSS_FILE')) {
  promise_test(async (t) => {
  // TODO: Doesn't look like parsing errors are properly reported. :/
    const element = document.createElement('style')

    element.appendChild(document.createTextNode(`@import url("${CONSTANTS[urlKey]}")`))

    const onLoad = new Promise((resolve, reject) => {
      element.onload = resolve
      element.onerror = reject
    })

    // Comment out to debug
    t.add_cleanup(async () => document.body.removeChild(element))

    document.body.appendChild(element)

    await onLoad
  }, `IPFS CSS Tag(Style @import) - ${urlKey}`)
}

for (const urlKey of makePermutations('CSS_FILE')) {
  promise_test(async (t) => {
    const element = document.createElement('link')

    element.rel = 'stylesheet'
    element.href = CONSTANTS[urlKey]

    const onLoad = new Promise((resolve, reject) => {
      element.onload = resolve
      element.onerror = reject
    })

    // Comment out to debug
    t.add_cleanup(async () => document.body.removeChild(element))

    document.body.appendChild(element)

    await onLoad
  }, `IPFS CSS Tag(Link) - ${urlKey}`)
}

for (const urlKey of makePermutations('JS_FILE')) {
  promise_test(async (t) => {
    const element = document.createElement('script')

    element.src = CONSTANTS[urlKey]

    const onLoad = new Promise((resolve, reject) => {
      element.onload = resolve
      element.onerror = reject
    })

    // Comment out to debug
    t.add_cleanup(async () => document.body.removeChild(element))

    document.body.appendChild(element)

    await onLoad

    assert_true(true, 'Loaded content')
  }, `IPFS Script Tag - ${urlKey}`)
}

for (const urlKey of makePermutations('JS_FILE')) {
  promise_test(async (t) => {
    const element = document.createElement('script')

    element.src = CONSTANTS[urlKey]
    element.type = 'module'

    const onLoad = new Promise((resolve, reject) => {
      element.onload = resolve
      element.onerror = reject
    })

    // Comment out to debug
    t.add_cleanup(async () => document.body.removeChild(element))

    document.body.appendChild(element)

    await onLoad

    assert_true(true, 'Loaded content')
  }, `IPFS Script Tag(module) - ${urlKey}`)
}

promise_test(async (t) => {
  const element = document.createElement('script')

  element.src = CONSTANTS.URL_IPFS_JS_FILE_IMPORT
  element.type = 'module'

  const onLoad = new Promise((resolve, reject) => {
    element.onload = resolve
    element.onerror = reject
  })

  // Comment out to debug
  t.add_cleanup(async () => document.body.removeChild(element))

  document.body.appendChild(element)

  await onLoad

  assert_true(true, 'Loaded content')
}, 'IPFS Script `import`')

promise_test(async (t) => {
  const element = document.createElement('script')

  element.src = CONSTANTS.URL_IPFS_JS_FILE_IMPORT_DYNAMIC
  element.type = 'module'

  const onLoad = new Promise((resolve, reject) => {
    element.onload = resolve
    element.onerror = reject
  })

  // Comment out to debug
  t.add_cleanup(async () => document.body.removeChild(element))

  document.body.appendChild(element)

  await onLoad

  assert_true(true, 'Loaded content')
}, 'IPFS Script `import()`')

for (const urlKey of makePermutations('JS_FILE')) {
  promise_test(async (t) => {
    const worker = new Worker(CONSTANTS[urlKey])

    const onLoad = new Promise((resolve, reject) => {
      worker.onmessage = resolve
      worker.onerror = reject
    })

    const message = await onLoad

    assert_true(message.example, 'Got example message from worker')
  }, `IPFS Script 'Worker()' - ${urlKey}`)
}

// promise_test(async (t) => {}, 'IPFS Script `ServiceWorker`')
// promise_test(async (t) => {}, 'IPFS Navigate via HREF')

for (const urlKey of makePermutations('TEXT_FILE')) {
  promise_test(async (t) => {
    const xhr = new XMLHttpRequest()

    const onLoad = new Promise((resolve, reject) => {
      xhr.onload = resolve
      xhr.onerror = reject
    })

    xhr.open('get', CONSTANTS[urlKey])
    xhr.send()

    await onLoad

    assert_equals(xhr.status, 200, 'Response code OK')

    assert_equals(xhr.responseText, 'Hello World\n', 'Got expected text')
  }, `IPFS XHR Request - ${urlKey}`)
}

for (const urlKey of makePermutations('TEXT_FILE')) {
  promise_test(async (t) => {
    const response = await fetch(CONSTANTS[urlKey])

    assert_true(response.ok, 'Response is OK')

    const text = await response.text()

    assert_equals(text, 'Hello World\n', 'Got expected text')
  }, `IPFS Fetch Request - ${urlKey}`)
}


for (const urlKey of makePermutations('HTML_FILE')) {
  promise_test(async (t) => {
    const element = document.createElement('iframe')

    element.src = CONSTANTS[urlKey]

    const onLoad = new Promise((resolve, reject) => {
      element.onload = resolve
      element.onerror = reject
    })

    // Comment out to debug
    t.add_cleanup(async () => document.body.removeChild(element))

    document.body.appendChild(element)

    await onLoad

    assert_true(element.contentWindow !== null, 'Loaded content')

    // Code 18 is the cross origin error
    assert_throws_dom(18, () => element.contentWindow.location.href, 'Cross-origin protects frame')
  }, `IPFS Iframe Tag - ${urlKey}`)
}
