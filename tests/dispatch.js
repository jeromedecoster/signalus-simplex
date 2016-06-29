var Signal = require('..')
var test = require('tape')

test('dispatch', function(t) {

  var sig1 = new Signal
  var sig2 = new Signal
  var ctx1 = { val:1 }
  var ctx2 = { val:2 }
  var ctx3 = { val:3 }
  var nbr1 = 0
  var nbr2 = 0
  var sum1 = 0

  function fun1() { nbr1++ }
  function fun2() { nbr2++; sum1 += this.val }

  // without context
  sig1.add(fun1)
  t.equals(nbr1, 0)
  sig1.dispatch()
  t.equals(nbr1, 1)
  sig1.dispatch()
  t.equals(nbr1, 2)
  sig1.dispatch()
  t.equals(nbr1, 3)

  // with context
  sig2.add(fun2, ctx1)
  sig2.add(fun2, ctx2)
  sig2.add(fun2, ctx3)
  sig2.dispatch()
  t.equals(nbr2, 3)
  t.equals(sum1, 6)

  t.end()
})

test('dispatch with args', function(t) {

  function noop() {}

  var sig1 = new Signal
  var ctx1 = { val:1, str:'' }
  var ctx2 = { val:3, str:'' }
  var ctx3 = { val:5, str:'' }
  var nbr1 = 0
  var sum1 = 0
  var arr1 = []

  function fun1(a, b, c) {
    nbr1++
    sum1 += this.val
    var s = `${a}-${b}-${c}`
    arr1.push(s)
    this.str += s
  }

  sig1.add(fun1, ctx1)
  sig1.add(fun1, ctx2)
  sig1.add(fun1, ctx3)
  sig1.dispatch(10, 30, 50)

  t.equals(nbr1, 3)
  t.equals(sum1, 9)
  t.deepEquals(arr1, ['10-30-50', '10-30-50', '10-30-50'])
  t.equals(ctx1.str, '10-30-50')
  t.equals(ctx2.str, '10-30-50')
  t.equals(ctx3.str, '10-30-50')

  t.end()
})

test('stop propagation', function(t) {

  var sig1 = new Signal
  var nbr1 = 0

  var fun1 = function() { nbr1++ }
  var fun2 = function() { return false }
  var fun3 = function() { nbr1++ }

  sig1.add(fun1)
  sig1.add(fun2)
  sig1.add(fun3)
  sig1.dispatch()

  t.equals(nbr1, 1)

  t.end()
})
