<template>
  <form @submit.prevent="submitForm">
    <div>
      <label for="fullName">Full name:</label>
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
      <label for="phone">Phone:</label>
      <input id="phone" v-model="formData.phone" type="tel" required>
    </div>
    
    <div>
      <label>Member type:</label>
      <select v-model="formData.memberType" required>
        <option value=""></option>
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
        <button type="button" @click="removeChild(index)">Remove Child</button>
      </div>
      <button type="button" @click="addChild" v-if="formData.children.length < 3">Add Child</button>
    </div>

    <div v-if="showStripeElement">
      <h3>Payment Information</h3>
      <div id="card-element-container">
        <div id="card-element"></div>
      </div>
      <div id="card-errors" role="alert"></div>
    </div>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Processing...' : 'Pay' }}
    </button>

    <div v-if="submissionMessage" :class="{ 'success': submissionSuccess, 'error': !submissionSuccess }">
      {{ submissionMessage }}
    </div>
  </form>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';

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
        children: []
      },
      stripe: null,
      card: null,
      showStripeElement: true,
      submissionMessage: '',
      submissionSuccess: false,
      isSubmitting: false,
      memberId: null
    }
  },
  async mounted() {
    this.stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY);
    if (!this.stripe) {
      console.error('Stripe failed to load');
      return;
    }
    const elements = this.stripe.elements();
    const style = {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#aab7c4'
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    this.card = elements.create('card', {style: style});
    this.card.mount('#card-element');
  },
  methods: {
    addChild() {
      if (this.formData.children.length < 3) {
        this.formData.children.push({ name: '', grade: '', performingArt: '' });
      }
    },
    removeChild(index) {
      this.formData.children.splice(index, 1);
    },
    async submitForm() {
      this.isSubmitting = true;
      this.submissionMessage = '';
      try {
        // First, submit form data
        const formResponse = await fetch('/.netlify/functions/submit-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.formData)
        });

        if (!formResponse.ok) {
          throw new Error('Form submission failed');
        }

        const formResult = await formResponse.json();
        this.memberId = formResult.memberId;

        // Then, process payment
        const { token, error } = await this.stripe.createToken(this.card);
        if (error) {
          throw new Error(error.message);
        }

        const paymentResponse = await fetch('/.netlify/functions/process-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            token: token.id,
            amount: 2600, // $26.00
            memberId: this.memberId
          })
        });

        if (!paymentResponse.ok) {
          throw new Error('Payment failed');
        }

        this.submissionSuccess = true;
        this.submissionMessage = 'Form submitted and payment successful!';
        
        // Reset form after successful submission
        this.resetForm();
      } catch (error) {
        console.error('Error:', error);
        this.submissionSuccess = false;
        this.submissionMessage = `Error: ${error.message}`;
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = {
        fullName: '',
        address: '',
        email: '',
        phone: '',
        memberType: '',
        children: []
      };
      this.card.clear();
    }
  }
}
</script>

<style scoped>

form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  margin: 0 auto;
  width: 100%;
}

form > div {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

label {
  font-weight: bold;
  display:block;
}

button {
  background-color: #ffe57c;
  color: #202020;
  font-weight: bold;
  font-size: 1rem;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}
button:hover {
  background-color: #fbcf1d;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.success {
  color: green;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
}

#card-element-container {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f9fa;
}

#card-element {
  width: 100%;
  padding: 10px 0;
}

#card-errors {
  color: #fa755a;
  margin-top: 10px;
  font-size: 14px;
}

/* Make inputs and selects consistent with the Stripe element */
input, select {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #f8F9fa;
}
</style>