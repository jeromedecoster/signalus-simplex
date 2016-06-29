var Signal = require('..')
var test = require('tape')

test('add', function(t) {

  function noop() {}

  var sig1 = new Signal
  var sig2 = new Signal
  var ctx1 = {}
  var ctx2 = {}
  var bool

  // without context
  t.equals(sig1.arr.length, 0)
  bool = sig1.add(noop)
  t.equals(sig1.arr.length, 1)
  t.equals(bool, true)
  bool = sig1.add(noop)
  // same function without context can be added only once
  t.equals(sig1.arr.length, 1)
  t.equals(bool, false)

  // with context
  t.equals(sig2.arr.length, 0)
  bool = sig2.add(noop)
  t.equals(sig2.arr.length, 1)
  t.equals(bool, true)
  bool = sig2.add(noop, ctx1)
  t.equals(sig2.arr.length, 2)
  t.equals(bool, true)
  // same function same context can be added only once
  bool = sig2.add(noop, ctx1)
  t.equals(sig2.arr.length, 2)
  t.equals(bool, false)
  bool = sig2.add(noop, ctx2)
  t.equals(sig2.arr.length, 3)
  t.equals(bool, true)
  bool = sig2.add(noop, ctx2)
  t.equals(sig2.arr.length, 3)
  t.equals(bool, false)
  t.end()
})

test('add while dispatch', function(t) {

  var sig1 = new Signal
  var ctx1 = { val:1 }
  var ctx2 = { val:3 }
  var ctx3 = { val:5 }
  var nbr1 = 0
  var bool = true

  function fun1() {
    nbr1 += this.val
    if (bool) sig1.add(fun1, ctx3)
  }

  sig1.add(fun1, ctx1)
  sig1.add(fun1, ctx2)
  sig1.dispatch()
  // added while dispatching must be ignored
  t.equals(nbr1, 4)

  bool = false
  nbr1 = 0
  // and not ignored in the next call
  sig1.dispatch()
  t.equals(nbr1, 9)
  t.end()
})

test('invalid cb', function(t) {

  var sig1 = new Signal
  var msg1

  var fun1 = function() {
    try {
      sig1.add({})
    } catch (e) {
      msg1 = e.message
    }
  }

  fun1()
  t.equals(msg1, 'Signal require a callback')
  t.end()
})
