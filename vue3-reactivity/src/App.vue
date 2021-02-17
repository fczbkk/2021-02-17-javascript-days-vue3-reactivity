<template>
  <h1>Vue3 reactivity demo</h1>
  <p>
    <input type="text" v-model="first">
    <input type="text" v-model="last">
  </p>
  <p>{{ first }} {{ last }}</p>
  <p><input type="number" v-model="single"></p>
  <p>
    {{ single }},
    {{ double }},
    {{ triple }},
    {{ quadruple }}
  </p>
</template>

<script>
import {
  reactive,
  ref,
  computed,
  watchEffect,
  watch,
  toRefs
} from 'vue'

export default {
  setup () {
    const name = reactive({ first: 'John', last: 'Doe' })

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

    return {
      ...toRefs(name),
      single,
      double,
      triple,
      quadruple
    }
  }
}
</script>
