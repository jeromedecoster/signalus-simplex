# signalus-simplex

> Simple signal messaging system

## Install

```bash
npm i signalus-simplex
```

Package [on npm](https://www.npmjs.com/package/signalus-simplex)

## API

* [add](#addcb-ctx-priority)
* [clear](#clear)
* [dispatch](#dispatcharg-arg-)
* [has](#hascb-ctx)
* [once](#oncecb-ctx-priority)
* [remove](#removecb-ctx)

#### add(cb, [ctx], [priority])

| Argument | Action |
| :------ | :------- |
| **cb** | the callback |
| **ctx** | optional context for `cb`, default to `undefined` |
| **priority** | optional priority, higher is invoked first, default to `0` |

Simple example

```js
const Signal = require('signalus-simplex')

var update = new Signal()

function cb(arg) {
  console.log('hello', arg)
}

update.add(cb)

// hello world
update.dispatch('world')
```

With context

```js
const Signal = require('signalus-simplex')

function cb(num) {
  console.log(num + this.val)
}

var ctx = { val:5 }

var update = new Signal()
update.add(cb, ctx)

// 15
update.dispatch(10)
```

With priority

```js
const Signal = require('signalus-simplex')

function fun1() { console.log('a') }
function fun2() { console.log('b') }
function fun3() { console.log('c') }

var update = new Signal()
update.add(fun1)
update.add(fun2)
update.add(fun3, null, 2)

// c
// a
// b
update.dispatch()
```

#### clear()

Remove all listeners

```js
const Signal = require('signalus-simplex')

function fun1() { console.log('a') }
function fun2() { console.log('b') }

update.add(fun1)
update.add(fun2)

// a
// b
update.dispatch()

update.clear()
update.dispatch() // do nothing
```

#### dispatch([arg], [arg], [...])

Dispatch with custom arguments

```js
const Signal = require('signalus-simplex')

function cb(a, b) {
  console.log('a:', b)
  console.log('b:', b)
}

var update = new Signal()
update.add(cb)

// a: foo
// b: bar
update.dispatch('foo', 'bar')
```

Stop propagation by returning `false`

```js
const Signal = require('signalus-simplex')

function fun1() { console.log('a'); return false }
function fun2() { console.log('b') }

update.add(fun1)
update.add(fun2)

// a
update.dispatch()
```

#### has(cb, [ctx])

Check if `cb` is already registered

Return `true` if the exact same association `cb` / `ctx` was found

```js
const Signal = require('signalus-simplex')

var update = new Signal()

function cb() {
  console.log('hello world')
}

// false
update.has(cb)

update.add(cb)

// true
update.has(cb)

update.remove(cb)

// false
update.has(cb)
```

#### once(cb, [ctx], [priority])

Like `add` but the callback `cb` will be invoked only once

The internal reference is automatically removed after the `dispatch`, using `remove` is not needed

Same options than [add](#addcb-ctx-priority)

```js
const Signal = require('signalus-simplex')

var update = new Signal()

function cb() {
  console.log('hello')
}

update.add(cb)

// hello
update.dispatch()

update.dispatch() // do nothing
```

#### remove(cb, [ctx])

Remove the listener `cb`

The listener is removed only if the exact same association `cb` / `ctx` was added

```js
const Signal = require('signalus-simplex')

function fun1() { console.log('a') }
function fun2() { console.log('b') }
function fun3() { console.log('c') }
function fun4() { console.log('d') }

var ctx1 = {}
var ctx2 = {}

update.add(fun1)
update.add(fun2)
update.add(fun3, ctx1)
update.add(fun4, ctx2)

update.remove(fun1)

// not removed because fun2 is registered without context
update.remove(fun2, ctx1)

// not removed because fun3 is registered with `ctx1`
update.remove(fun3)
update.remove(fun4, ctx2)

// b
// c
update.dispatch()
```

## Thanks

Mainly forked / inspired on
- [min-signal](https://github.com/edankwan/min-signal)
- [js-signals](https://github.com/millermedeiros/js-signals)

## License

MIT
