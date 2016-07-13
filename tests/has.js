var Signal = require('..')
var test = require('tape')

test('has', function(t) {

  var sig = new Signal
  var nbr1 = 0
  var nbr2 = 0
  var ctx1 = {}
  var ctx2 = {}

  function fun1() { nbr1++ }
  function fun2() { nbr2++ }

  t.equals(sig.arr.length, 0)
  t.equals(sig.has(fun1),  false)
  sig.once(fun1)
  t.equals(sig.has(fun1),  true)

  t.equals(sig.arr.length, 1)
  t.equals(sig.has(fun2),  false)
  sig.add(fun2)
  t.equals(sig.has(fun2),  true)

  t.equals(sig.arr.length, 2)

  sig.dispatch()
  t.equals(nbr1,          1)
  t.equals(nbr2,          1)
  t.equals(sig.has(fun1), false)
  t.equals(sig.has(fun2), true)

  sig.dispatch()
  t.equals(nbr1,          1)
  t.equals(nbr2,          2)
  t.equals(sig.has(fun1), false)
  t.equals(sig.has(fun2), true)

  sig.remove(fun2)
  sig.dispatch()
  t.equals(nbr1,          1)
  t.equals(nbr2,          2)
  t.equals(sig.has(fun1), false)
  t.equals(sig.has(fun2), false)

  // with context
  t.equals(sig.arr.length,      0)
  t.equals(sig.has(fun1),       false)
  sig.once(fun1, ctx1)
  t.equals(sig.has(fun1),       false)
  t.equals(sig.has(fun1, ctx1), true)
  sig.dispatch()
  t.equals(sig.has(fun1),       false)
  t.equals(sig.has(fun1, ctx1), false)

  t.equals(sig.arr.length,      0)
  t.equals(sig.has(fun2),       false)
  sig.add(fun2, ctx2)
  t.equals(sig.has(fun2),       false)
  t.equals(sig.has(fun2, ctx2), true)
  sig.dispatch()
  t.equals(sig.has(fun2),       false)
  t.equals(sig.has(fun2, ctx2), true)
  sig.remove(fun2)
  t.equals(sig.has(fun2, ctx2), true)
  sig.remove(fun2, ctx2)
  t.equals(sig.has(fun2, ctx2), false)

  t.end()
})
