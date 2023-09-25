<script setup>
const currentStep = ref(0)
const isActive = (item) => {
  console.log('item   ', item)
  return item.index === currentStep.value ? true : false
}
</script>

<template>
  <div>
    <div class="header">
      <Steps
        :model="petProfileSteps"
        aria-label="Form Steps"
        :readonly="true"
        :pt="{
          menuitem: ({ context }) => ({
            class: isActive(context.item) && 'p-highlight p-steps-current',
          }),
        }"
      >
      </Steps>
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
$container-breakpoint-sm: 470px;
.header {
  position: sticky;
  top: 10px;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #fff;
  z-index: 100;
  container-type: inline-size;
  .p-steps {
    @container (max-width: #{$container-breakpoint-sm}) {
      font-size: 0.75rem;
    }
  }
}
</style>
