module.exports = Signal

const msg = 'Signal require a callback'

function Signal() {
  this.arr = []
  this.tmp = []
  this.running = false
}

Signal.prototype.add = function(cb, ctx, priority, once) {
  if (typeof cb !== 'function') throw new Error(msg)

  if (typeof priority !== 'number' || priority !== priority) priority = 0

  var ref = this.running !== true ? this.arr : this.tmp

  for (var i = 0, n = ref.length; i < n; i++) {
    if (ref[i].cb === cb && ref[i].ctx === ctx) return false
  }

  ref.push({cb:cb, ctx:ctx, priority:priority, once:once})
  if (this.running === false) this.arr.sort(order)

  return true
}

Signal.prototype.once = function(cb, ctx, priority) {
  return this.add(cb, ctx, priority, true)
}

Signal.prototype.remove = function(cb, ctx) {
  if (typeof cb !== 'function') throw new Error(msg)

  for (var i = this.arr.length - 1; i >= 0; i--) {
    if (this.arr[i].cb === cb && this.arr[i].ctx === ctx) {
      this.arr.splice(i, 1)
      return true
    }
  }
  return false
}

Signal.prototype.clear = function() {
  this.arr.length = 0
}

Signal.prototype.dispatch = function() {
  this.running = true
  for (var i = 0; i < this.arr.length; i++) {
    if (this.arr[i].cb.apply(this.arr[i].ctx, arguments) === false) break
  }
  this.running = false

  for (var i = this.arr.length - 1; i >= 0; i--) {
    if (this.arr[i].once === true) {
      this.arr.splice(i, 1)
    }
  }

  if (this.tmp.length) {
    this.arr = this.arr.concat(this.tmp)
    this.arr.sort(order)
    this.tmp.length = 0
  }
}

function order(a, b) {
  if (a.priority < b.priority) return 1
  if (a.priority > b.priority) return -1
  return 0
}
