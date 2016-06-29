var Signal = require('..')
var test = require('tape')

test('priority', function(t) {

  function noop() {}

  var sig1 = new Signal
  var sig2 = new Signal
  var sig3 = new Signal
  var sig4 = new Signal
  function fun1() { str1 += 'a' }
  function fun2() { str1 += 'b' }
  function fun3() { str1 += 'c' }
  var str1 = ''

  sig1.add(fun1, null,      0)
  sig1.add(fun2, {},        0)
  sig1.add(fun3, undefined, 0)
  sig1.dispatch()
  t.equals(str1, 'abc')

  str1 = ''
  sig2.add(fun1, null,      0)
  sig2.add(fun2, {},        1)
  sig2.add(fun3, undefined, 2)
  sig2.dispatch()
  t.equals(str1, 'cba')

  str1 = ''
  sig3.add(fun1, null,       1)
  sig3.add(fun2, {},         2)
  sig3.add(fun3, undefined, -2)
  sig3.dispatch()
  t.equals(str1, 'bac')

  str1 = ''
  sig4.add(fun1)
  sig4.add(fun2, {}, 1)
  sig4.add(fun3)
  sig4.dispatch()
  t.equals(str1, 'bac')

  t.end()
})

test('add while dispatch', function(t) {

  var sig1 = new Signal
  var ctx1 = { val:1, char:'a' }
  var ctx2 = { val:3, char:'b' }
  var ctx3 = { val:5, char:'c' }
  var nbr1 = 0
  var str1 = ''
  var bool = true

  function fun1() {
    nbr1 += this.val
    str1 += this.char
    if (bool) sig1.add(fun1, ctx3, 2)
  }

  sig1.add(fun1, ctx1, 0)
  sig1.add(fun1, ctx2, 1)
  sig1.dispatch()
  // added while dispatching must be ignored
  t.equals(nbr1, 4)
  t.equals(str1, 'ba')

  bool = false
  str1 = ''
  nbr1 = 0
  // and not ignored in the next call
  sig1.dispatch()
  t.equals(nbr1, 9)
  t.equals(str1, 'cba')
  t.end()
})
