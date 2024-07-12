<template>
  <div class="content">
    <div class="fee">
      <div class="item">2024-25 <br/>Annual membership fee</div>
      <div class="cost">$26.00</div>
    </div>
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
      
      <div v-if="formData.memberType === 'parent'" class="parent">
        <h3>Children Information</h3>
        <div v-for="(child, index) in formData.children" :key="index" class="children">
          <h4>Child {{ index + 1 }}</h4>
          
          <div>
            <label>Student's Name</label>
            <input v-model="child.name" required>
          </div>

          <div>
            <label>Grade</label>
            <input v-model="child.grade" required>
          </div>
          
          <div>
            <fieldset>
              <legend>Performing Arts:</legend>
              <div v-for="art in performingArts" :key="art.value">
                <input 
                  type="checkbox" 
                  :id="`child-${index}-${art.value}`" 
                  :value="art.value" 
                  v-model="child.performingArts"
                >
                <label :for="`child-${index}-${art.value}`">{{ art.label }}</label>
              </div>
            </fieldset>
          </div>
          <button v-if="index !== 0" type="button" class="remove" @click="removeChild(index)">Remove Child</button>
        </div>
        <button type="button" @click="addChild" v-if="formData.children.length > 0 && formData.children.length < 4">Add Another Child</button>
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
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'vue-router';

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
      performingArts: [
        { value: 'chorus', label: 'Chorus' },
        { value: 'orchestra', label: 'Orchestra' },
        { value: 'band', label: 'Band' },
        { value: 'theater', label: 'Theater' },
        { value: 'dance', label: 'Dance' }
      ],
      stripe: null,
      card: null,
      showStripeElement: true,
      submissionMessage: '',
      submissionSuccess: false,
      isSubmitting: false,
      memberId: null
    }
  },
  created() {
    this.router = useRouter();
  },
  watch: {
    'formData.memberType': function(newValue) {
      if (newValue === 'parent' && this.formData.children.length === 0) {
        this.addChild();
      }
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
      if (this.formData.children.length < 4) {
        this.formData.children.push({
          name: '',
          grade: '',
          performingArts: []
        });
      }
    },
    removeChild(index) {
      this.formData.children.splice(index, 1);
    },
    async submitForm() {
      this.isSubmitting = true;
      this.submissionMessage = '';
      try {
        // Prepare the form data, joining performingArts into a string
        const formDataToSend = {
          ...this.formData,
          children: this.formData.children.map(child => ({
            ...child,
            performingArts: child.performingArts.join(', ')
          }))
        };


        // First, submit form data
        const formResponse = await fetch('/.netlify/functions/submit-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formDataToSend)
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
        this.$router.push('/success');
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
  line-height:1.8rem;
}

.fee .cost {
  font-size: 3rem;
}

@media only screen and (max-width: 768px) {
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

form, .children {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  margin: 0 auto;
  width: 100%;
}

form > div, .children > div {
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

button.remove {
  width: auto;
  background-color:#fff;
  border: 2px solid #ffe57c;
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

/* iOS-specific adjustments */
@supports (-webkit-touch-callout: none) {
  select {
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position: right 0.7em top 50%;
    background-size: 0.65em auto;
    padding-right: 1.5em;
  }
}

fieldset {
  margin-bottom: 1rem;
}

fieldset input {
  width: auto;
}

fieldset > div {
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem 0;
  align-items: center;
}


</style>