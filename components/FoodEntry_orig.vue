<script setup>
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

const emit = defineEmits(['update:product', 'update:times', 'remove'])
const internalProduct = ref(props.product)
const internalTimes = ref(props.times)
</script>

<template>
  <div class="food-entry flex gap-3 align-items-center p-fluid">
    <InputText
      v-model="internalProduct"
      type="text"
      placeholder="Food name"
      :class="{
        'p-invalid': invalid,
      }"
      @update:modelValue="emit('update:product', $event)"
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
        :min="0"
        :max="9"
        @update:modelValue="emit('update:times', $event)"
      />
      <p class="text-sm flex-none">times a day</p>
    </div>
    <Button
      rounded
      text
      severity="secondary"
      icon="pi pi-trash"
      class="border-none shadow-none"
      @click="emit('remove', $event)"
      :disabled="totalLength === 1 && index === 0"
    />
  </div>
</template>

<style lang="scss" scoped>
.food-entry {
}
</style>
