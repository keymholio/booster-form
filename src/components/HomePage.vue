<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-image">
        <img src="@/assets/hero-background.jpg" alt="Wantagh Performing Arts">
      </div>
      <div class="hero-content">
        <div class="hero-text">
          <h1>Support Wantagh Performing Arts</h1>
          <p>Join our booster club and help nurture young talent in our community.</p>
          <router-link to="/join" class="cta-button">Join Now</router-link>
        </div>
      </div>
    </section>

    <section class="benefits">
      <h2>Benefits of Joining</h2>
      <div class="benefit-icons">
        <div class="benefit">
          <img src="@/assets/user-music-regular.svg" alt="Support Icon">
          <h3>Support Students</h3>
          <p>Directly contribute to the success of our performing arts programs</p>
        </div>
        <div class="benefit">
          <img src="@/assets/people-roof-regular.svg" alt="Community Icon">
          <h3>Build Community</h3>
          <p>Connect with other parents and supporters of the arts</p>
        </div>
        <div class="benefit">
          <img src="@/assets/masks-theater-regular.svg" alt="Events Icon">
          <h3>Enhance Programs</h3>
          <p>Provide resources, funding, and support for performances and educational experiences</p>
        </div>
        <div class="benefit">
          <img src="@/assets/bullhorn-regular.svg" alt="Voice Icon">
          <h3>Have a Voice</h3>
          <p>Influence decisions that shape our arts programs</p>
        </div>
      </div>
    </section>

    <!-- New Linktree promo section -->
    <section class="linktree-promo">
      <div class="promo-image">
        <img src="@/assets/linktree-promo.png" alt="Linktree Promo">
      </div>
      <div class="promo-content">
        <h2>Stay connected</h2>
        <p>Get the latest updates about the Wantagh Performing Arts Booster Club. Find all our important links, events, and resources on our Linktree page.</p>
        <a href="https://linktr.ee/WPABC" target="_blank" rel="noopener noreferrer" class="cta-button">Visit Our Linktree</a>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home-page {
  width: 100%;
}

.hero {
  display: flex;
  height: 500px; /* Adjust as needed */
}

.hero-image {
  flex: 1;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block; /* Removes any potential whitespace */
}

.hero-content {
  flex: 1;
  background-color: #202026; /* Dark gray background */
  color: white;
  display: flex;
  align-items: center;
  padding: 4rem;
  line-height: 1.5rem;
}

.hero h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  line-height: 2.2rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 3.5rem;
  background-color: #ffe57c;
  color: #202020;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #fbcf1d;
}

.benefits {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.benefits h2 {
  margin-bottom: 2rem;
}

.benefit-icons {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.benefit {
  flex-basis: calc(25% - 2rem);
  margin: 1rem;
  line-height: 1.4rem;
}

.benefit img {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
}

.linktree-promo {
  display: flex;
  max-width: 1000px;
  margin: 4rem auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.promo-image {
  flex: 1;
  min-height: 300px;
  overflow: hidden;
}

.promo-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.promo-content {
  flex: 1;
  padding: 1rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.promo-content h2 {
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
  color: #202020;
}

.promo-content p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #4a4a4a;
  line-height: 1.5;
}

.cta-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #ffe57c;
  color: #202020;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #fbcf1d;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    height: auto;
  }

  .hero-image img {
    height: 250px; /* Adjust as needed */
  }

  .hero-content {
    padding: 2rem 2.5rem 3rem;
  }

  .hero-text {
    width: 100%;
    max-width: 700px;
  }

  .hero h1 {
    font-size: 1.5rem;
    text-align: center;
  }

  .hero p {
    font-size: 1rem;
    text-align: center;
  }

  .cta-button {
    display: block;
    width: 100%;
    text-align: center;
  }

  .benefit {
    flex-basis: calc(50% - 2rem);
  }
  .linktree-promo {
    flex-direction: column;
    margin: 2rem;
  }

  .promo-image {
    min-height: 200px;
  }

  .promo-content {
    align-items: center;
    text-align: center;
  }

  .cta-button {
    width: 100%;
    text-align: center;
  }
}
</style>