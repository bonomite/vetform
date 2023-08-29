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

const phone = ref('')
function verify() {
alert(phone.value)
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
	<hr />
	<div class="flex flex-column">
    <label for="phone">Phone</label>
    <InputMask v-model="phone" date="phone" mask="(999) 999-9999" placeholder="(999) 999-9999" />
    <small id="username-help">Enter your username to reset your password.</small>

	<Button label="Continue" @click="verify"/>

</div>
</template>
