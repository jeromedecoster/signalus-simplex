var Signal = require('..')
var test = require('tape')

test('once', function(t) {

  var sig1 = new Signal
  var sig2 = new Signal
  var ctx1 = {}
  var ctx2 = {}
  var nbr1 = 0
  var nbr2 = 0
  var bool

  function fun1() { nbr1++ }
  function fun2() { nbr2++ }

  // without context
  t.equals(sig1.arr.length, 0)
  bool = sig1.once(fun1)
  t.equals(sig1.arr.length, 1)
  t.equals(bool, true)
  bool = sig1.once(fun1)
  // same function without context can be added only once
  t.equals(sig1.arr.length, 1)
  t.equals(bool, false)

  sig1.dispatch()
  t.equals(nbr1, 1)
  sig1.dispatch()
  t.equals(nbr1, 1)
  t.equals(sig1.arr.length, 0)

  // with context
  t.equals(sig2.arr.length, 0)
  bool = sig2.once(fun2)
  t.equals(sig2.arr.length, 1)
  t.equals(bool, true)
  bool = sig2.once(fun2, ctx1)
  t.equals(sig2.arr.length, 2)
  t.equals(bool, true)
  // same function same context can be added only once
  bool = sig2.once(fun2, ctx1)
  t.equals(sig2.arr.length, 2)
  t.equals(bool, false)
  bool = sig2.once(fun2, ctx2)
  t.equals(sig2.arr.length, 3)
  t.equals(bool, true)
  bool = sig2.once(fun2, ctx2)
  t.equals(sig2.arr.length, 3)
  t.equals(bool, false)

  sig2.dispatch()
  t.equals(nbr2, 3)
  t.equals(sig2.arr.length, 0)
  sig2.dispatch()
  t.equals(nbr2, 3)
  t.equals(sig2.arr.length, 0)
  t.end()
})

