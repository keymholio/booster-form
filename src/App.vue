<template>
  <div id="app">
    <header>
      <div>Wantagh Performing Arts Booster Club</div>
      <img alt="Booster logo" src="./assets/booster-logo.svg">
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App'
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
  margin-left: 1rem;
}

@media only screen and (max-width: 768px) {
  header {
    font-size: 1.5rem;
  }
}
</style>