<script setup>
const { $gsap } = useNuxtApp()

const props = defineProps({
  product: {
    type: String,
    required: true,
  },
  times: {
    type: Number,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  totalLength: {
    type: Number,
    required: true,
  },
  invalid: {
    type: Boolean,
    required: false,
  },
})

const emit = defineEmits(['update', 'remove'])
const internalProduct = ref(props.product)
const internalTimes = ref(props.times)

const inputTextRef = ref(null)
const foodEntryRef = ref(null)

const update = () => {
  emit('update', {
    product: internalProduct.value,
    times_a_day: internalTimes.value,
  })
}

const remove = (e) => {
  $gsap.to(foodEntryRef.value, {
    opacity: 0,
    height: 0,
    duration: 0.25,
    onComplete: () => {
      emit('remove', e)
    },
  })
}

const setFocus = () => {
  console.log('focus')
  foodEntryRef.value.getElementsByClassName('p-inputtext')[0].focus()
}

onMounted(() => {
  if (internalProduct.value) {
    $gsap.set(foodEntryRef.value, { opacity: 1, height: 52 })
  } else {
    $gsap.to(foodEntryRef.value, { opacity: 1, height: 52, duration: 0.25 })
  }
})

defineExpose({
  setFocus,
})
</script>

<template>
  <div
    ref="foodEntryRef"
    class="food-entry flex gap-3 align-items-center p-fluid"
  >
    <InputText
      v-model="internalProduct"
      type="text"
      placeholder="Food name"
      :class="{
        'p-invalid': invalid,
      }"
      @update:modelValue="update"
    />
    <div class="flex flex-none gap-1">
      <InputNumber
        class="number-inc-dec"
        v-model="internalTimes"
        inputId="horizontal-buttons"
        showButtons
        buttonLayout="horizontal"
        :step="1"
        incrementButtonIcon="pi pi-plus"
        decrementButtonIcon="pi pi-minus"
        :min="1"
        :max="9"
        @update:modelValue="update"
      />
      <p class="text-sm flex-none">times a day</p>
    </div>
    <Button
      rounded
      text
      severity="secondary"
      icon="pi pi-trash"
      class="border-none shadow-none"
      @click="remove"
      :disabled="totalLength === 1 && index === 0"
    />
  </div>
</template>

<style lang="scss" scoped>
.food-entry {
  opacity: 0;
  height: 0;
  overflow: hidden;
}
</style>
