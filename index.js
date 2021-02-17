const REACTIVE_OBJECTS = new Set()
const REACTIVE_OBJECT_IDENTIFIER = Symbol()

const handler = {
  get: function (obj, key) {
    if (key === REACTIVE_OBJECT_IDENTIFIER) {
      return obj
    }
    return obj[key]
  },
  set: function (obj, key, val) {
    const oldValue = obj[key]
    if (val !== oldValue) {
      obj[key] = val
      REACTIVE_OBJECTS.forEach(({ fn, target }) => {
        if (target) {
          if (target[REACTIVE_OBJECT_IDENTIFIER] === obj) {
            fn(val, oldValue)
          }
        } else {
          fn()
        }
      })
    }
  },
}

function reactive (target) {
  return new Proxy(target, handler)
}

function ref (target) {
  return new Proxy({ value: target }, handler)
}

function computed (fn) {
  const result = ref(fn())
  REACTIVE_OBJECTS.add({
    fn: () => result.value = fn()
  })
  return result
}

function watchEffect (fn) {
  REACTIVE_OBJECTS.add({ fn })
}

function watch (target, fn) {
  REACTIVE_OBJECTS.add({ fn, target })
}

function toRefs (target) {
  const result = {}

  Object.keys(target).forEach((key) => {
    const refVal = ref(target[key])
    watch(refVal, () => target[key] = refVal.value)
    result[key] = refVal
  })

  watch(target, () => {
    Object.keys(target).forEach((key) => {
      result[key].value = target[key]
    })
  })

  return result
}

const name = reactive({ first: 'John', last: 'Doe' })
const { first, last } = toRefs(name)
name.first = 'Riki'
last.value = 'Fridrich'

console.log(name, first.value, last.value)

const single = ref(0)

const double = computed(() => single.value * 2)

const triple = ref(0)
watchEffect(() => {
  triple.value = single.value * 3
})

const quadruple = ref(0)
watch(single, (newValue, oldValue) => {
  console.log('single changed from', oldValue, 'to', newValue)
  quadruple.value = single.value * 4
})

console.log('before', single.value, double.value, triple.value, quadruple.value)
single.value = 10
console.log('after', single.value, double.value, triple.value, quadruple.value)
