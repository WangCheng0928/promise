// function fun (n, o) {
//   console.log(o)
//   return {
//     fun: function (m) {
//       return fun(m, n)
//     }
//   }
// }

// var a = fun(0); a.fun(1); a.fun(2); a.fun(3)
// var b = fun(0).fun(1).fun(2).fun(3);
// var c = fun(0).fun(1); c.fun(2); c.fun(3);

var pageWidth = window.innerWidth
var pageHeigth = window.innerHeight
console.log(pageWidth, pageHeigth)

var outWidth = window.outerWidth
var outHeigth = window.outerHeight
console.log(outWidth, outHeigth)
console.log(window.top === window)
console.log(window.parent === window)
console.log(window.screenX)
console.log(window.screenY)
console.log(document.documentElement.clientWidth)
console.log(document.documentElement.clientHeight)
console.log(document.documentElement.clientTop)
console.log(document.documentElement.clientLeft)
console.log(window.location.href)
document.title = "test reset title"
console.log(document.URL)