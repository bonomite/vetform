<script setup>
const { $gsap } = useNuxtApp()

const props = defineProps({
  product: {
    type: String,
    required: true,
  },
  dose: {
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
const internalDose = ref(props.dose)
const internalTimes = ref(props.times)

const medsEntryRef = ref(null)

const update = () => {
  emit('update', {
    product: internalProduct.value,
    times_a_day: internalTimes.value,
    dose: internalDose.value,
  })
}

const remove = (e) => {
  $gsap.to(medsEntryRef.value, {
    opacity: 0,
    height: 0,
    duration: 0.25,
    onComplete: () => {
      emit('remove', e)
    },
  })
}

const setFocus = () => {
  //console.log('focus')
  medsEntryRef.value.getElementsByClassName('p-inputtext')[0].focus()
}

onMounted(() => {
  if (internalProduct.value) {
    $gsap.set(medsEntryRef.value, { opacity: 1, height: 110 })
  } else {
    $gsap.to(medsEntryRef.value, { opacity: 1, height: 110, duration: 0.25 })
  }
})

defineExpose({
  setFocus,
})
</script>

<template>
  <div
    ref="medsEntryRef"
    class="meds-entry flex column-gap-2 row-gap-0 align-items-center p-fluid flex-column sm:flex-row"
  >
    <div class="flex gap-2">
      <InputText
        v-model="internalProduct"
        type="text"
        placeholder="Product name"
        :class="{
          'p-invalid': invalid,
        }"
        @update:modelValue="update"
      />
      <InputText
        v-model="internalDose"
        type="text"
        placeholder="Dose"
        :class="{
          'p-invalid': invalid,
        }"
        @update:modelValue="update"
      />
    </div>
    <div class="flex gap-2 align-items-center justify-content-between w-full sm:w-auto">
      <div class="flex gap-1 align-items-center">
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
        <p class="text-sm line-height-1">times a day</p>
      </div>
      <Button
        rounded
        text
        severity="secondary"
        icon="pi pi-trash"
        class="border-none shadow-none delete-btn"
        @click="remove"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.meds-entry {
  opacity: 0;
  height: 0;
  overflow: hidden;
  .delete-btn {
  }
}
</style>
