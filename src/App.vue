<template>
  <div id="app">
    <h1>Club Signup Form</h1>
    <MembershipForm />
  </div>
</template>

<script>
import MembershipForm from './components/MembershipForm.vue'

export default {
  name: 'App',
  components: {
    MembershipForm
  }
}
</script>