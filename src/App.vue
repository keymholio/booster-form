<template>
  <div id="app">
    <header>
      <div>Wantagh Performing Arts Booster Club</div>
      <img alt="Booster logo" src="./assets/booster-logo.svg">
    </header>
    <div class="content">
      <div class="fee">
        <div class="item">Membership fee</div>
        <div class="cost">$26.00</div>
      </div>
      <MembershipForm />
    </div>
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

<style>
* {
  box-sizing: border-box;
}

html, body {
  padding: 0;
  margin: 0;
  background-color: #fafafa;
  color: #202020;
}

#app {
  font-family: Georgia, 'Times New Roman', Times, serif;
}

header {
  background-color: #000;
  display: flex;
  justify-content: space-between;
  font-size: 2rem;
  color: #fff;
  padding: 1rem 2rem;
  align-items: center;
}

header img {
  width: 100px;
}

.content {
  display: flex;
  flex-wrap: wrap;
  max-width: 920px;
  margin: 2rem auto;
  gap: 2rem;
}

.content > form {
  flex: 1 1 60%;
  width: 100%; /* Ensure it takes full width */
}

.fee {
  flex: 1 1 30%;
  padding: 1rem 0 0 3rem;
}

.fee .item {
  color: #555;
  font-size: 1.2rem;
}

.fee .cost {
  font-size: 3rem;
}

@media only screen and (max-width: 768px) {
  header {
    font-size: 1.5rem;
  }
  
  .content {
    flex-direction: column;
    align-items: stretch;
  }

  .fee {
    order: -1;
    flex-basis: 100%;
    padding: 1rem 0;
    text-align: center;
  }
  
  .content > form {
    flex-basis: 100%;
  }
}

@media only screen and (max-width: 920px) {
  .content {
    margin-right: 2rem;
    margin-left: 2rem;
  }
}
</style>