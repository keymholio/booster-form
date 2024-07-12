<template>
  <div id="app">
    <header>
      <router-link to="/" class="header-link">
        <div>Wantagh Performing Arts Booster Club</div>
        <img alt="Booster logo" src="./assets/booster-logo.svg">
      </router-link>
    </header>
    <router-view></router-view>
    <SiteFooter />
  </div>
</template>

<script>
import SiteFooter from './components/SiteFooter.vue'

  export default {
    name: 'App',
    components: {
      SiteFooter
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
  
  font-size: 2rem;
  color: #fff;
  padding: 1rem 2rem;
  
}

header img {
  width: 100px;
  margin-left: 1rem;
}

.header-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media only screen and (max-width: 768px) {
  header {
    font-size: 1.5rem;
  }
}
</style>