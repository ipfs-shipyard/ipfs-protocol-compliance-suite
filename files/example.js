/* global self */
if (typeof window !== 'undefined') {
  window.postMessage({ example: true }, '*')
} else if (typeof self !== 'undefined') {
  self.postMessage({ example: true }, '*')
} else {
  console.log('Hello World!')
}
