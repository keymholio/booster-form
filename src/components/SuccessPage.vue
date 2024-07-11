<template>
    <div class="success-page">
      <h1>Thank you for becoming a member!</h1>
      <p>We appreciate your support of the Wantagh Performing Arts Booster Club.</p>
      <div class="social-links">
        <a href="https://linktr.ee/WPABC" target="_blank" rel="noopener noreferrer">
          <img src="@/assets/people-group-regular.svg" alt="Links">
          Get involved
        </a>
        <a href="https://www.instagram.com/wantaghperformingartsbooster" target="_blank" rel="noopener noreferrer">
          <img src="@/assets/instagram.svg" alt="Instagram">
          Follow us on Instagram
        </a>
        <a href="https://www.facebook.com/groups/wpabc" target="_blank" rel="noopener noreferrer">
          <img src="@/assets/square-facebook.svg" alt="Facebook">
          Like us on Facebook
        </a>
        <a href="mailto:wantaghperformingartsbooster@gmail.com">
          <img src="@/assets/envelope-regular.svg" alt="Email">
          Email us
        </a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SuccessPage'
  }
  </script>
  
  <style scoped>
  .success-page {
    text-align: center;
    padding: 2rem;
  }
  
  .social-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
  }
  
  .social-links a {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    padding: 0.5rem 1rem;
    background-color: #ffe57c;
    border-radius: 5px;
    text-decoration: none;
    color: #333;
    transition: background-color 0.3s;
  }
  
  .social-links a:hover {
    background-color: #fbcf1d;
  }
  
  .social-links img {
    width: 24px;
    height: 24px;
    margin-right: 0.5rem;
  }
  </style>