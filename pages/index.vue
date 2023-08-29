<script setup>
	const gtm = useGtm()
	function triggerEvent() {
		gtm.trackEvent({
			event: 'login',
			category: 'GTM Test',
			action: 'click',
			label: 'Login',
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
	<p>
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo, corporis veritatis? Voluptatem impedit assumenda explicabo. Harum est ex voluptas minus ipsa id ullam. Quam numquam,
		reprehenderit dignissimos corrupti sapiente odio tempora! Quis dolorum, assumenda eligendi nobis veritatis eaque natus adipisci laboriosam eum labore qui quo iste, facilis excepturi ratione.
	</p>
	<NuxtLink to="/login" @click="triggerEvent">Login</NuxtLink>
	<hr />
	<!-- <Button label="Click Me" url="/login" /> -->
	<hr />
	<NuxtLink to="https://blender.org">Blender</NuxtLink>
</template>
