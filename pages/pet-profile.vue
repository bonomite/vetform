<script setup>
const items = ref([
  {
    label: 'Your Pet',
    route: '/',
  },
  {
    label: 'Lifestyle',
    route: '/seat',
  },
  {
    label: 'Rx/Preventatives',
    route: '/payment',
  },
  {
    label: 'Insurance',
    route: '/confirmation',
  },
])

const currentStep = ref(0)

const isActive = (item) => {
  console.log('item   ', item)
  return false
}
</script>

<template>
  <div>
    <h1>Pet Profile</h1>
    <div class="card">
      <Steps
        :model="items"
        aria-label="Form Steps"
        :readonly="true"
        :pt="{
          menuitem: ({ context }) => ({
            class: isActive(context.item) && 'p-highlight p-steps-current',
          }),
        }"
      >
        <!-- <template #item="{ label, item, index, props }">
          <router-link
            v-if="item.route"
            v-slot="routerProps"
            :to="item.route"
            custom
          >
            <a
              :href="routerProps.href"
              v-bind="props.action"
              @click="($event) => routerProps.navigate($event)"
              @keydown.enter="($event) => routerProps.navigate($event)"
            >
              <span v-bind="props.step">{{ index + 1 }}</span>
              <span v-bind="props.label">{{ label }}</span>
            </a>
          </router-link>
          <span v-else v-bind="props.action">
            <span v-bind="props.step">{{ index + 1 }}</span>
            <span v-bind="props.label">{{ label }}</span>
          </span>
        </template> -->
      </Steps>
    </div>
  </div>
</template>
