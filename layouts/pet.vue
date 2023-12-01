<script setup>
import { useCurrentPetProfileStep } from "~/composables/states.ts"
const currentPetProfileStep = useCurrentPetProfileStep()
//const currentStep = ref(0)
const isActive = (item) => {
  //console.log('item   ', item)
  return item.index === currentPetProfileStep.value ? true : false
}
</script>

<template>
  <div>
    <div class="header">
      <Steps
        :model="PET_PROFILE_STEPS"
        aria-label="Form Steps"
        :readonly="true"
        v-model:activeStep="currentPetProfileStep"
      ></Steps>
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
$container-breakpoint-sm: 470px;
.header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 10px 0;
  background-color: #fff;
  z-index: 100;
  container-type: inline-size;
  -webkit-box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
  .p-steps {
    @container (max-width: #{$container-breakpoint-sm}) {
      font-size: 0.75rem;
    }
  }
}
</style>
