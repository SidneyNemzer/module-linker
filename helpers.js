/* global chrome */

const fetch = window.fetch

var waitToken = new Promise((resolve, reject) => {
  chrome.storage.sync.get('token', ({token}) => {
    if (chrome.runtime.lastError) {
      reject(chrome.runtime.lastError.message)
    } else {
      resolve(token)
    }
  })
})

module.exports.gh = function (path) {
  return waitToken
  .then(token =>
    fetch(`https://api.github.com/${path}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'github.com/fiatjaf/module-linker',
        'Authorization': `token ${token}`
      }
    })
    .then(r => {
      return r.json()
    })
  )
}

module.exports.bloburl = function (user, repo, ref, path) {
  path = path[0] === '/' ? path.slice(1) : path
  return `https://github.com/${user}/${repo}/blob/${ref}/${path}`
}

module.exports.treeurl = function (user, repo, ref, path) {
  path = path[0] === '/' ? path.slice(1) : path
  return `https://github.com/${user}/${repo}/tree/${ref}/${path}`
}

module.exports.createLink = function createLink (elem, moduleName, url) {
  if (!moduleName) return // blank module names do happen (in Python, when there's `from . import x`).

  let link = `<a class="module-linker" href="${url}">${moduleName}</a>`

  let index = elem.innerHTML.lastIndexOf(moduleName)
  elem.innerHTML = elem.innerHTML.slice(0, index) +
    link +
    elem.innerHTML.slice(index + moduleName.length)
}
