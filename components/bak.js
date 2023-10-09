<script setup>
const props = defineProps({
  modelProduct: {
    type: String,
    required: true,
  },
  modelTimes: {
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
})

const emit = defineEmits(['update:modelProduct', 'update:modelTimes', 'remove'])
const internalProduct = ref(props.modelProduct)
const internalTimes = ref(props.modelTimes)

watch(internalProduct, (newProduct) => {
  emit('update:modelProduct', newProduct)
})

watch(internalTimes, (newTimes) => {
  emit('update:modelTimes', newTimes)
})
</script>

<template>
  <div class="food-entry flex gap-3 align-items-center p-fluid">
    <InputText v-model="internalProduct" type="text" placeholder="Food name" />
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
        :min="0"
        :max="9"
      />
      <p class="text-sm flex-none">times a day</p>
    </div>
    <Button
      rounded
      text
      severity="secondary"
      icon="pi pi-trash"
      class="border-none shadow-none"
      @click="$emit('remove', $event)"
      :disabled="totalLength === 1 && index === 0"
    />
  </div>
</template>

<style lang="scss" scoped>
.food-entry {
}
</style>
