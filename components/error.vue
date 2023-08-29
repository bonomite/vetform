<script setup>
const props = defineProps({
  errArr: {
    type: Array,
    required: true,
    default: [],
  },
})
</script>

<template>
  <small v-if="errArr.length > 0" class="p-error error">
    <span v-for="err of errArr" :key="err.$uid">
      {{ err.$message }}
    </span>
  </small>
</template>

<style lang="scss" scoped>
.error {
}
</style>
