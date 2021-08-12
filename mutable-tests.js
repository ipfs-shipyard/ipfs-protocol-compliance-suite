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

promise_test(async (t) => {
  const postResponse = await fetch(`ipfs://${TEST_FILE_NAME}`, {
    method: 'POST',
    body: TEST_FILE_CONTENT
  })

  assert_true(postResponse.ok, 'Able to POST')

  const url = await postResponse.text()

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
}, 'POST text file to IPFS without infohash')

promise_test(async (t) => {
  const firstFileResponse = await fetch(`ipfs://${TEST_FILE_NAME}`, {
    method: 'POST',
    body: TEST_FILE_CONTENT
  })

  assert_true(firstFileResponse.ok, 'Able to post first file')

  const url = await firstFileResponse.text()

  const base = new URL('./', url).href

  const secondFileResponse = await fetch(new URL(`./${OTHER_TEST_FILE_NAME}`, base).href, {
    method: 'POST',
    body: OTHER_TEST_FILE_CONTENT
  })

  assert_true(secondFileResponse.ok, 'Able to post second file')

  const secondUrl = await secondFileResponse.text()

  assert_true(secondUrl.startsWith('ipfs://'), 'Got an IPFS url for the content')
  assert_true(secondUrl.endsWith(OTHER_TEST_FILE_NAME), 'URL ends with the file name')

  const secondBase = new URL('./', secondUrl).href

  const listingRequest = await fetch(secondBase)

  const listing = await listingRequest.text()

  assert_true(listing.includes(TEST_FILE_NAME), 'First file shows up in parent folder')
  assert_true(listing.includes(OTHER_TEST_FILE_NAME), 'Second file shows up in parent folder')
}, 'POST text file to existing infohash')

promise_test(async (t) => {
  const firstFileResponse = await fetch(`ipfs://${TEST_FILE_NAME}`, {
    method: 'POST',
    body: TEST_FILE_CONTENT
  })

  assert_true(firstFileResponse.ok, 'Able to post first file')

  const url = await firstFileResponse.text()

  const base = new URL('./', url).href

  const ipnsResponse = await fetch('ipns://compliance-suite-example1/', {
    method: 'POST',
    body: base
  })

  assert_true(ipnsResponse.ok, 'Able to POST url to ipns')

  const ipnsUrl = await ipnsResponse.text()

  assert_true(ipnsUrl.startsWith('ipns://'), 'Got an IPNS URL')
  assert_true(ipnsUrl.endsWith('/'), 'Ends as a directory')

  const listingRequest = await fetch(ipnsUrl)

  assert_true(listingRequest.ok, 'Able to GET from IPNS')

  const listing = await listingRequest.text()

  assert_true(listing.includes(TEST_FILE_NAME), 'File shows up in IPNS folder')
}, 'POST IPFS URL to IPNS')

promise_test(async (t) => {
  const formData = new FormData()

  formData.append('file', new Blob([TEST_FILE_CONTENT]), TEST_FILE_NAME)
  formData.append('file', new Blob([OTHER_TEST_FILE_CONTENT]), OTHER_TEST_FILE_NAME)

  const postResponse = await fetch('ipfs:///', {
    method: 'POST',
    body: formData
  })

  assert_true(postResponse.ok, 'Able to POST')

  const url = await postResponse.text()

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
}, 'POST FormData with files to IPFS')

promise_test(async (t) => {
  const firstFileResponse = await fetch(`ipfs://${TEST_FILE_NAME}`, {
    method: 'POST',
    body: TEST_FILE_CONTENT
  })

  assert_true(firstFileResponse.ok, 'Able to post first file')

  const url = await firstFileResponse.text()

  const base = new URL('./', url).href

  const ipnsResponse = await fetch('ipns://compliance-suite-example2/', {
    method: 'POST',
    body: base
  })

  assert_true(ipnsResponse.ok, 'Able to POST url to ipns')

  const ipnsUrl = await ipnsResponse.text()

  const secondFileResponse = await fetch(`ipns://compliance-suite-example2/${OTHER_TEST_FILE_NAME}`, {
    method: 'POST',
    body: OTHER_TEST_FILE_CONTENT
  })

  assert_true(secondFileResponse.ok, 'Able to POST file to existing IPNS path')

  const listingRequest = await fetch(ipnsUrl)

  assert_true(listingRequest.ok, 'Able to GET from IPNS')

  const listing = await listingRequest.text()

  assert_true(listing.includes(TEST_FILE_NAME), 'First file shows up in IPNS folder')
  assert_true(listing.includes(OTHER_TEST_FILE_NAME), 'Secondt file shows up in IPNS folder')
}, 'POST text file to IPNS with existing data')
