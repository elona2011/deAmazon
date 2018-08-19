for (let i = 0; i < 1000; i++) {
  setTimeout(function() {
    var t1 = +new Date()
    localStorage.setItem('testcookie', document.cookie)
    var t2 = new Date() - t1
    t2 > 100 ? console.log(t2) : ''
  }, 500 * i)
}
