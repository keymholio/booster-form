<template>
    <div class="home-page">
      <section class="hero">
        <h1>Support Wantagh Performing Arts</h1>
        <p>Join our booster club and help nurture young talent in our community.</p>
        <router-link to="/join" class="cta-button">Join Now</router-link>
      </section>
  
      <section class="benefits">
        <h2>Benefits of Joining</h2>
        <div class="benefit-icons">
          <div class="benefit">
            <img src="@/assets/user-music-regular.svg" alt="Support Icon">
            <h3>Support Students</h3>
            <p>Directly contribute to the success of our performing arts programs.</p>
          </div>
          <div class="benefit">
            <img src="@/assets/people-roof-regular.svg" alt="Community Icon">
            <h3>Build Community</h3>
            <p>Connect with other parents and supporters of the arts.</p>
          </div>
          <div class="benefit">
            <img src="@/assets/masks-theater-regular.svg" alt="Events Icon">
            <h3>Exclusive Events</h3>
            <p>Gain access to member-only events and performances.</p>
          </div>
          <div class="benefit">
            <img src="@/assets/bullhorn-regular.svg" alt="Voice Icon">
            <h3>Have a Voice</h3>
            <p>Influence decisions that shape our arts programs.</p>
          </div>
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .hero {
    text-align: center;
    padding: 4rem 2rem;
    background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('@/assets/hero-background.jpg');
    background-size: cover;
    color: white;
    border-radius: 8px;
    margin-bottom: 2rem;
  }
  
  .hero h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
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
  
  .benefits {
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
  }
  
  .benefit img {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 768px) {
    .benefit {
      flex-basis: calc(50% - 2rem);
    }
  }
  </style>