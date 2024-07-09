<template>
  <form @submit.prevent="submitForm">
    <div>
      <label for="fullName">Full Name:</label>
      <input id="fullName" v-model="formData.fullName" required>
    </div>
    
    <div>
      <label for="address">Address:</label>
      <input id="address" v-model="formData.address" required>
    </div>
    
    <div>
      <label for="email">Email:</label>
      <input id="email" v-model="formData.email" type="email" required>
    </div>
    
    <div>
      <label for="phone">Phone Number:</label>
      <input id="phone" v-model="formData.phone" type="tel" required>
    </div>
    
    <div>
      <label>Member Type:</label>
      <select v-model="formData.memberType" required>
        <option value="parent">Parent</option>
        <option value="staff">Staff</option>
        <option value="community">Community Member</option>
        <option value="other">Other Supporter</option>
      </select>
    </div>
    
    <div v-if="formData.memberType === 'parent'">
      <h3>Children Information</h3>
      <div v-for="(child, index) in formData.children" :key="index">
        <h4>Child {{ index + 1 }}</h4>
        <input v-model="child.name" placeholder="Student's Name" required>
        <input v-model="child.grade" placeholder="Grade" required>
        <select v-model="child.performingArt" required>
          <option value="">Select Performing Art</option>
          <option value="chorus">Chorus</option>
          <option value="orchestra">Orchestra</option>
          <option value="band">Band</option>
          <option value="theater">Theater</option>
          <option value="dance">Dance</option>
        </select>
      </div>
      <button type="button" @click="addChild" v-if="formData.children.length < 3">Add Child</button>
    </div>

    <div>
      <label>Payment Method:</label>
      <select v-model="formData.paymentMethod" required>
        <option value="venmo">Venmo ($26)</option>
        <option value="check">Send Check Later</option>
      </select>
    </div>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </button>

    <div v-if="submissionMessage" :class="{ 'success': submissionSuccess, 'error': !submissionSuccess }">
      {{ submissionMessage }}
    </div>
  </form>
</template>


<script>
export default {
  name: 'MembershipForm',
  data() {
    return {
      formData: {
        fullName: '',
        address: '',
        email: '',
        phone: '',
        memberType: '',
        children: [],
        paymentMethod: ''
      },
      submissionMessage: '',
      submissionSuccess: false,
      isSubmitting: false
    }
  },
  methods: {
    addChild() {
      if (this.formData.children.length < 3) {
        this.formData.children.push({ name: '', grade: '', performingArt: '' });
      }
    },
    async submitForm() {
      this.isSubmitting = true;
      this.submissionMessage = '';
      try {
        const response = await fetch('/.netlify/functions/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const result = await response.json();
        
        this.submissionSuccess = true;
        this.submissionMessage = result.message || 'Form submitted successfully!';
        
        if (this.formData.paymentMethod === 'venmo') {
          window.open('https://venmo.com/your-venmo-account', '_blank');
        }
      } catch (error) {
        console.error('Error:', error);
        this.submissionSuccess = false;
        this.submissionMessage = `Error: ${error.message}`;
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>


<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.success { color: green; }
.error { color: red; }
</style>