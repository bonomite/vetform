<script setup>
	const gtm = useGtm()
	function triggerEvent() {
		gtm.trackEvent({
			event: 'Test Click',
			category: 'GTM Test',
			action: 'click',
			label: 'Click Me',
			value: 5000,
			noninteraction: false,
		})
	}

	function triggerView() {
		gtm.trackView('Home', '/')
	}
</script>
<template>
	<h1>Hello!</h1>
	<Button label="Click Me" @click="triggerEvent" />
</template>
