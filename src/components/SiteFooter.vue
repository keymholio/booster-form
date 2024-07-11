<template>
    <footer>
      <div class="footer-content">
        <p>&copy; {{ currentYear }} Wantagh Performing Arts Booster Club</p>
        <router-link to="/info">Customer Service & Policies</router-link>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'SiteFooter',
    computed: {
      currentYear() {
        return new Date().getFullYear();
      }
    }
  }
  </script>
  
  <style scoped>
  footer {
    background-color: #f8f9fa;
    padding: 1rem;
    text-align: center;
    margin-top: 2rem;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  a {
    color: #007bff;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>