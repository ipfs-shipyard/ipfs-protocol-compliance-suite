/* global
promise_test,
assert_true,
assert_equals,
fetch,
*/

const TEST_FILE_CONTENT = 'Hello World'
const TEST_FILE_NAME = 'example.txt'
const OTHER_TEST_FILE_CONTENT = 'Goodby World'
const OTHER_TEST_FILE_NAME = 'example2.txt'
const EMPTY_DIR_URL = 'ipfs://bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354'

setup({ timeout_multiplier: 2 })

promise_test(async (t) => {
  const putResponse = await fetch(`${EMPTY_DIR_URL}/${TEST_FILE_NAME}`, {
    method: 'PUT',
    body: TEST_FILE_CONTENT
  })

  assert_true(putResponse.status == 201, 'Able to PUT')

  const url = await putResponse.headers.get("Location")

  assert_true(url.startsWith('ipfs://'), 'Got an IPFS url for the content')
  assert_true(url.endsWith(TEST_FILE_NAME), 'URL ends with the file name')

  const getResponse = await fetch(url)

  assert_true(getResponse.ok, 'Able to use URL from POST')

  const text = await getResponse.text()

  assert_equals(text, TEST_FILE_CONTENT, 'Got content back out')

  const base = new URL('./', url).href

  const listingRequest = await fetch(base)

  const listing = await listingRequest.text()

  assert_true(listing.includes(TEST_FILE_NAME), 'File shows up in parent folder')
}, 'PUT text file to IPFS inside empty dir')

promise_test(async (t) => {
  const firstFileResponse = await fetch(`${EMPTY_DIR_URL}/${TEST_FILE_NAME}`, {
    method: 'PUT',
    body: TEST_FILE_CONTENT
  })

  assert_true(firstFileResponse.status == 201, 'Able to PUT first file')

  const url = await firstFileResponse.headers.get("Location")

  const base = new URL('./', url).href

  const secondFileResponse = await fetch(new URL(`./${OTHER_TEST_FILE_NAME}`, base).href, {
    method: 'PUT',
    body: OTHER_TEST_FILE_CONTENT
  })

  assert_true(secondFileResponse.status == 201, 'Able to post second file')

  const secondUrl = await secondFileResponse.headers.get("Location")

  assert_true(secondUrl.startsWith('ipfs://'), 'Got an IPFS url for the content')
  assert_true(secondUrl.endsWith(OTHER_TEST_FILE_NAME), 'URL ends with the file name')

  const secondBase = new URL('./', secondUrl).href

  const listingRequest = await fetch(secondBase)

  const listing = await listingRequest.text()

  assert_true(listing.includes(TEST_FILE_NAME), 'First file shows up in parent folder')
  assert_true(listing.includes(OTHER_TEST_FILE_NAME), 'Second file shows up in parent folder')
}, 'PUT text file to existing infohash')

promise_test(async (t) => {
  const firstFileResponse = await fetch(`${EMPTY_DIR_URL}/${TEST_FILE_NAME}`, {
    method: 'PUT',
    body: TEST_FILE_CONTENT
  })

  assert_true(firstFileResponse.status == 201, 'Able to PUT first file')

  const url = await firstFileResponse.headers.get("Location")

  const base = new URL('./', url).href

  const secondFileResponse = await fetch(new URL(`./${OTHER_TEST_FILE_NAME}`, base).href, {
    method: 'PUT',
    body: OTHER_TEST_FILE_CONTENT
  })

  assert_true(secondFileResponse.status == 201, 'Able to PUT second file')

  const secondUrl = await secondFileResponse.headers.get("Location")

  const secondBase = new URL('./', secondUrl).href

  const listingRequest = await fetch(secondBase)

  const listing = await listingRequest.text()

  assert_true(listing.includes(TEST_FILE_NAME), 'First file shows up in parent folder')
  assert_true(listing.includes(OTHER_TEST_FILE_NAME), 'Second file shows up in parent folder')

  const deleteResponse = await fetch(secondUrl, {
    method: 'DELETE'
  })

  assert_true(deleteResponse.status == 201, 'Able to DELETE file URL')

  const finalUrl = await deleteResponse.headers.get("Location")

  assert_true(finalUrl.startsWith('ipfs://'), 'Got an IPFS url for the content')
  assert_true(finalUrl.endsWith('/'), 'URL ends with a / to signify a directory')

  const finalListingRequest = await fetch(finalUrl)

  const finalListing = await finalListingRequest.text()

  assert_true(finalListing.includes(TEST_FILE_NAME), 'First file still shows up in folder')
  assert_true(!finalListing.includes(OTHER_TEST_FILE_NAME), 'Second file no longer shows up in folder')
}, 'DELETE file from an infohash')

promise_test(async (t) => {
  const key = `compliance-suite-${Date.now()}`
  const createKey = await fetch(`ipns://localhost?key=${key}`, {
    method: 'POST',
  })
  assert_true(createKey.status == 201, 'Able to create key')
  const keyURL = createKey.headers.get("Location")

  const firstFileResponse = await fetch(`${keyURL}${TEST_FILE_NAME}`, {
    method: 'PUT',
    body: TEST_FILE_CONTENT
  })
  assert_true(firstFileResponse.status == 200, 'Able to PUT first file')

  const base = new URL('./', keyURL).href

  const secondUrl = new URL(`./${OTHER_TEST_FILE_NAME}`, base).href

  const secondFileResponse = await fetch(secondUrl, {
    method: 'PUT',
    body: OTHER_TEST_FILE_CONTENT
  })

  assert_true(secondFileResponse.status == 200, 'Able to PUT second file')

  const listingRequest = await fetch(base)

  const listing = await listingRequest.text()

  assert_true(listing.includes(TEST_FILE_NAME), 'First file shows up in parent folder')
  assert_true(listing.includes(OTHER_TEST_FILE_NAME), 'Second file shows up in parent folder')

  const deleteResponse = await fetch(secondUrl, {
    method: 'DELETE'
  })

  assert_true(deleteResponse.status == 200, 'Able to DELETE file URL')

  const finalListingRequest = await fetch(base)

  const finalListing = await finalListingRequest.text()

  assert_true(finalListing.includes(TEST_FILE_NAME), 'First file still shows up in folder')
  assert_true(!finalListing.includes(OTHER_TEST_FILE_NAME), 'Second file no longer shows up in folder')
}, 'DELETE file from IPNS', { timeout: 120 * 1000 })

promise_test(async (t) => {
  const firstFileResponse = await fetch(`${EMPTY_DIR_URL}/${TEST_FILE_NAME}`, {
    method: 'PUT',
    body: TEST_FILE_CONTENT
  })

  assert_true(firstFileResponse.status == 201, 'Able to post first file')

  const url = await firstFileResponse.headers.get("Location")

  const base = new URL('./', url).href

  const key = `POST-IPFS-TO-IPNS`
  const createKey = await fetch(`ipns://localhost?key=${key}`, {
    method: 'POST',
  })
  assert_true(createKey.status == 201, 'Able to create key')
  const keyURL = createKey.headers.get("Location")

  const ipnsResponse = await fetch(keyURL, {
    method: 'POST',
    body: base
  })

  assert_true(ipnsResponse.status == 200, 'Able to POST url to ipns')

  const getResponse = await fetch(keyURL)
  const text = await getResponse.text()

  assert_equals(text, TEST_FILE_CONTENT, 'Got content back out')
}, 'POST IPFS URL to IPNS')

promise_test(async (t) => {
  const key = `compliance-suite-${Date.now()}`
  const createKey = await fetch(`ipns://localhost?key=${key}`, {
    method: 'POST',
  })
  assert_true(createKey.status == 201, 'Able to create key')
  const keyURL = createKey.headers.get("Location")

  const ipnsResponse = await fetch(keyURL, {
    method: 'PUT',
    body: TEST_FILE_CONTENT
  })

  assert_true(ipnsResponse.status == 200, 'Able to PUT file to ipns')

  const getResponse = await fetch(keyURL)
  const text = await getResponse.text()

  assert_equals(text, TEST_FILE_CONTENT, 'Got content back out')
}, 'PUT IPFS file to IPNS', { timeout: 120 * 1000 })

promise_test(async (t) => {
  const key = `compliance-suite-${Date.now()}`
  const createKey = await fetch(`ipns://localhost?key=${key}`, {
    method: 'POST',
  })
  assert_true(createKey.status == 201, 'Able to create key')
  const keyURL = createKey.headers.get("Location")

  const ipnsResponse = await fetch(`${keyURL}test`, {
    method: 'PUT',
    body: TEST_FILE_CONTENT
  })

  assert_true(ipnsResponse.status == 200, 'Able to PUT url to ipns')

  const getResponse = await fetch(`${keyURL}test`)
  const text = await getResponse.text()

  assert_equals(text, TEST_FILE_CONTENT, 'Got content back out')
}, 'PUT IPFS file to IPNS subpath')

promise_test(async (t) => {
  const formData = new FormData()

  formData.append('file', new Blob([TEST_FILE_CONTENT]), TEST_FILE_NAME)
  formData.append('file', new Blob([OTHER_TEST_FILE_CONTENT]), OTHER_TEST_FILE_NAME)

  const key = `compliance-suite-${Date.now()}`
  const createKey = await fetch(`ipns://localhost?key=${key}`, {
    method: 'POST',
  })
  assert_true(createKey.status == 201, 'Able to create key')
  const keyURL = createKey.headers.get("Location")

  const putResponse = await fetch(keyURL, {
    method: 'PUT',
    body: formData
  })

  assert_true(putResponse.status == 200, 'Able to PUT')

  const getResponse = await fetch(`${keyURL}${TEST_FILE_NAME}`)

  assert_true(getResponse.status === 200, 'Able to get uploaded file')

  const text = await getResponse.text()

  assert_equals(text, TEST_FILE_CONTENT, 'Got content back out')

  const listingRequest = await fetch(keyURL)

  const listing = await listingRequest.text()

  assert_true(listing.includes(TEST_FILE_NAME), 'File shows up in parent folder')
  assert_true(listing.includes(OTHER_TEST_FILE_NAME), 'Other file shows up in parent folder')
}, 'PUT FormData to IPNS', { timeout: 120 * 1000 })

promise_test(async (t) => {
  const formData = new FormData()

  formData.append('file', new Blob([TEST_FILE_CONTENT]), TEST_FILE_NAME)
  formData.append('file', new Blob([OTHER_TEST_FILE_CONTENT]), OTHER_TEST_FILE_NAME)

  const key = `compliance-suite-${Date.now()}`
  const createKey = await fetch(`ipns://localhost?key=${key}`, {
    method: 'POST',
  })
  assert_true(createKey.status == 201, 'Able to create key')
  const keyURL = createKey.headers.get("Location")

  const putResponse = await fetch(new URL("/test", keyURL).href, {
    method: 'PUT',
    body: formData
  })

  assert_true(putResponse.status == 200, 'Able to PUT')

  const getResponse = await fetch(new URL(`/test/${TEST_FILE_NAME}`, keyURL).href)

  assert_true(getResponse.ok, 'Able to use URL from POST')

  const text = await getResponse.text()

  assert_equals(text, TEST_FILE_CONTENT, 'Got content back out')

  const listingRequest = await fetch(new URL('/test', keyURL).href)

  const listing = await listingRequest.text()

  assert_true(listing.includes(TEST_FILE_NAME), 'File shows up in parent folder')
  assert_true(listing.includes(OTHER_TEST_FILE_NAME), 'Other file shows up in parent folder')
}, 'PUT FormData to IPNS subpath', { timeout: 120 * 1000 })

promise_test(async (t) => {
  const formData = new FormData()

  formData.append('file', new Blob([TEST_FILE_CONTENT]), TEST_FILE_NAME)
  formData.append('file', new Blob([OTHER_TEST_FILE_CONTENT]), OTHER_TEST_FILE_NAME)

  const putResponse = await fetch(EMPTY_DIR_URL, {
    method: 'PUT',
    body: formData
  })

  assert_true(putResponse.status == 201, 'Able to PUT')

  const url = await putResponse.headers.get("Location")

  assert_true(url.startsWith('ipfs://'), 'Got an IPFS url for the content')
  assert_true(url.endsWith('/'), 'URL is a directory')

  const getResponse = await fetch(url + TEST_FILE_NAME)

  assert_true(getResponse.ok, 'Able to use URL from POST')

  const text = await getResponse.text()

  assert_equals(text, TEST_FILE_CONTENT, 'Got content back out')

  const listingRequest = await fetch(url)

  const listing = await listingRequest.text()

  assert_true(listing.includes(TEST_FILE_NAME), 'File shows up in parent folder')
  assert_true(listing.includes(OTHER_TEST_FILE_NAME), 'Other file shows up in parent folder')
}, 'PUT FormData with files to IPFS')

promise_test(async (t) => {
  const firstFileResponse = await fetch(`${EMPTY_DIR_URL}/${TEST_FILE_NAME}`, {
    method: 'PUT',
    body: TEST_FILE_CONTENT
  })

  assert_true(firstFileResponse.status == 201, 'Able to PUT first file')

  const url = await firstFileResponse.headers.get("Location")

  const base = new URL('./', url).href

  const key = `compliance-suite-${Date.now()}`
  const createKey = await fetch(`ipns://localhost?key=${key}`, {
    method: 'POST',
  })
  assert_true(createKey.status == 201, 'Able to create key')
  const keyURL = createKey.headers.get("Location")

  const ipnsResponse = await fetch(`${keyURL}${TEST_FILE_NAME}`, {
    method: 'POST',
    body: base
  })

  assert_true(ipnsResponse.status == 200, 'Able to POST url to ipns')

  const secondFileResponse = await fetch(`${EMPTY_DIR_URL}/${OTHER_TEST_FILE_NAME}`, {
    method: 'PUT',
    body: OTHER_TEST_FILE_CONTENT
  })

  assert_true(secondFileResponse.status == 201, 'Able to PUT second file')

  const url2 = await secondFileResponse.headers.get("Location")

  const base2 = new URL('./', url2).href

  const ipnsResponse2 = await fetch(`${keyURL}${OTHER_TEST_FILE_NAME}`, {
    method: 'POST',
    body: base2
  })

  assert_true(ipnsResponse2.status == 200, 'Able to POST url to existing IPNS key')

  const listingRequest = await fetch(keyURL)

  assert_true(listingRequest.ok, 'Able to GET from IPNS')

  const listing = await listingRequest.text()

  assert_true(listing.includes(TEST_FILE_NAME), 'First file shows up in IPNS folder')
  assert_true(listing.includes(OTHER_TEST_FILE_NAME), 'Second file shows up in IPNS folder')
}, 'POST url to IPNS with existing data')

promise_test(async (t) => {
  const key = `compliance-suite-${Date.now()}`
  const getKey = await fetch(`ipns://localhost?key=${key}`, {
    method: 'GET',
  })
  assert_true(getKey.status == 404, "key doesn't exist yet")

  const createKey = await fetch(`ipns://localhost?key=${key}`, {
    method: 'POST',
  })
  assert_true(createKey.status == 201, 'Able to create key')
  const keyURL = createKey.headers.get("Location")

  // Upload file so key resolves when GET is done later
  const ipnsResponse = await fetch(keyURL, {
    method: 'PUT',
    body: TEST_FILE_CONTENT
  })
  assert_true(ipnsResponse.status == 200, 'Able to PUT url to ipns')

  const getKey2 = await fetch(`ipns://localhost?key=${key}`, {
    method: 'GET',
  })
  // Should redirect to key ^
  assert_true(getKey2.status == 200, '200, redirected to key')
  assert_true(getKey2.url == keyURL, 'redirected to correct key URL')
}, 'GET IPNS key', { timeout: 120 * 1000 })

promise_test(async (t) => {
  const key = `compliance-suite-${Date.now()}`
  const createKey = await fetch(`ipns://localhost?key=${key}`, {
    method: 'POST',
  })
  assert_true(createKey.status == 201, 'Able to create key')

  const deleteKey = await fetch(`ipns://localhost?key=${key}`, {
    method: 'DELETE',
  })
  assert_true(deleteKey.status == 200, '200, deleted key')

  const getKey = await fetch(`ipns://localhost?key=${key}`, {
    method: 'GET',
  })
  assert_true(getKey.status == 404, "404, key doesn't exist")
}, 'DELETE IPNS key')
