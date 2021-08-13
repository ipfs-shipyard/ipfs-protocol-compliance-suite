/* global
promise_test,
assert_true,
assert_equals,
fetch,
*/

import {
  URL_IPFS_TEXT_FILE_RAW
} from './constants.js'

// TODO: These tests currently don't pass in any browsers.
// Based on https://github.com/ipfs/go-ipfs/issues/8234
// Work on this is pending on gateway support / API availability

promise_test(async (t) => {
  const response = await fetch(URL_IPFS_TEXT_FILE_RAW + '?format=car')

  assert_true(response.ok, 'Able to get CID')

  assert_true(response.headers.get('Content-Type').includes('application/octet-stream'), 'Got binary content type')

  const content = await response.arrayBuffer()

  assert_true(content.byteLength > 0, 'Content is non-empty')
  // TODO: Check the content format
}, 'GET CID as a CAR file')
promise_test(async (t) => {
  const response = await fetch(URL_IPFS_TEXT_FILE_RAW + '?format=block')

  assert_true(response.ok, 'Able to get CID')

  assert_true(response.headers.get('Content-Type').includes('application/octet-stream'), 'Got binary content type')

  const content = await response.arrayBuffer()

  assert_true(content.byteLength > 0, 'Content is non-empty')
  // TODO: Check the content format
}, 'GET CID as a block')
promise_test(async (t) => {
  const response = await fetch(URL_IPFS_TEXT_FILE_RAW + '?format=dag-json')

  assert_true(response.ok, 'Able to get CID')

  assert_true(response.headers.get('Content-Type').includes('application/json'), 'Got binary content type')

  const content = await response.json()

  assert_true(content && Object.keys(content).length !== 0, 'Content is non-empty')
  // TODO: Check the content format
}, 'GET CID as a dag-json file')
promise_test(async (t) => {
  const response = await fetch(URL_IPFS_TEXT_FILE_RAW + '?format=dag-cbor')

  assert_true(response.ok, 'Able to get CID')

  assert_true(response.headers.get('Content-Type').includes('application/cbor'), 'Got binary content type')

  const content = await response.arrayBuffer()

  assert_true(content.byteLength > 0, 'Content is non-empty')
  // TODO: Check the content format
}, 'GET CID as a dag-cbor file')

promise_test(async (t) => {
  // Data will be saved as dag-cbor
  const postResponse = await fetch('ipfs://?format=dag-cbor', {
    method: 'POST',
    headers: {
      // Data is represented as JSON before it's converted
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      hello: 'World'
    })
  })

  assert_true(postResponse.ok, 'Able to POST JSON')

  const url = await postResponse.text()

  assert_true(url.startsWith('ipfs://'), 'Returned IPFS URL')

  const getResponse = await fetch(url + '?format=dag-cbor')

  assert_true(getResponse.ok, 'Able to get CID')

  assert_true(getResponse.headers.get('Content-Type').includes('application/cbor'), 'Got binary content type')

  const content = await getResponse.arrayBuffer()

  assert_true(content.byteLength > 0, 'Content is non-empty')
}, 'POST JSON, get CBOR from CID')
promise_test(async (t) => {
  const postResponse1 = await fetch('ipfs://?format=dag-cbor', {
    method: 'POST',
    headers: {
      // Data is represented as JSON before it's converted
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      hello: 'World'
    })
  })

  assert_true(postResponse1.ok, 'Able to POST JSON')

  const url1 = await postResponse1.text()

  const postResponse2 = await fetch(url1 + '/newField?format=dag-cbor', {
    method: 'POST',
    headers: {
      // Data is represented as JSON before it's converted
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      goodbye: 'World'
    })
  })

  assert_true(postResponse2.ok, 'Able to POST over CID')

  const url2 = await postResponse2.text()

  assert_true(url2.startsWith('ipfs://'), 'Returned IPFS URL')

  const getResponse = await fetch(url2 + '?format=dag-json')

  assert_true(getResponse.ok, 'Able to GET new CID')

  const content = await getResponse.json()

  assert_equals(content?.newKey?.goodbye, 'world', 'Subkey got added to content')
}, 'POST JSON (as cbor), POST on top of CID, get JSON')
