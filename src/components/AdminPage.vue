<template>
    <div class="admin-page">
      <h1>Manage Members</h1>
      <div v-if="!isAuthenticated">
        <h2>Login</h2>
        <input v-model="password" type="password" placeholder="Enter password">
        <button @click="authenticate">Login</button>
      </div>
      <div v-else>
        <h2>Members</h2>
        <div class="action-buttons">
          <button @click="openModal('create')">Add New Member</button>
          <button @click="exportToCsv">Export to CSV</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Member Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.id">
              <td>{{ member.full_name }}</td>
              <td>{{ member.email }}</td>
              <td>
                {{ member.member_type }}
                <a 
                  href="#" 
                  @click.prevent="showChildrenModal(member)" 
                  v-if="member.member_type === 'parent' && member.children && member.children.length"
                  class="children-link"
                >
                  ({{ member.children.length }} {{ member.children.length === 1 ? 'child' : 'children' }})
                </a>
              </td>
              <td>
                <button @click="openModal('edit', member)">Edit</button>
                <button @click="deleteMember(member.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Modal for Edit/Create -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h2>{{ modalMode === 'edit' ? 'Edit Member' : 'Create New Member' }}</h2>
          <form @submit.prevent="saveMember">
            <div>
              <label for="fullName">Full name:</label>
              <input id="fullName" v-model="currentMember.full_name" required>
            </div>
            
            <div>
              <label for="address">Address:</label>
              <input id="address" v-model="currentMember.address" required>
            </div>
            
            <div>
              <label for="email">Email:</label>
              <input id="email" v-model="currentMember.email" type="email" required>
            </div>
            
            <div>
              <label for="phone">Phone:</label>
              <input id="phone" v-model="currentMember.phone" type="tel" required>
            </div>
            
            <div>
              <label for="memberType">Member type:</label>
              <select id="memberType" v-model="currentMember.member_type" required>
                <option value=""></option>
                <option value="parent">Parent</option>
                <option value="staff">Staff</option>
                <option value="community">Community Member</option>
                <option value="other">Other Supporter</option>
              </select>
            </div>
            
            <div v-if="currentMember.member_type === 'parent'">
              <h3>Children Information</h3>
              <div v-for="(child, index) in currentMember.children" :key="index">
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
                <button type="button" @click="removeChild(index)" v-if="index !== 0">Remove Child</button>
              </div>
              <button type="button" @click="addChild">Add Child</button>
            </div>
  
            <button type="submit">{{ modalMode === 'edit' ? 'Update' : 'Create' }}</button>
          </form>
        </div>
      </div>
  
      <!-- Modal for Children List -->
      <div v-if="showChildrenModalFlag" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeChildrenModal">&times;</span>
          <h2>Children of {{ currentMember.full_name }}</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Grade</th>
                <th>Performing Arts</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(child, index) in currentMember.children" :key="index">
                <td>{{ child.name }}</td>
                <td>{{ child.grade }}</td>
                <td>{{ Array.isArray(child.performingArts) ? child.performingArts.join(', ') : child.performingArts || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { createClient } from '@supabase/supabase-js'
  
  export default {
    name: 'AdminPage',
    data() {
      return {
        supabase: null,
        isAuthenticated: false,
        password: '',
        members: [],
        showModal: false,
        showChildrenModalFlag: false,
        modalMode: 'create',
        currentMember: {
          full_name: '',
          address: '',
          email: '',
          phone: '',
          member_type: '',
          children: []
        },
        performingArts: [
          { value: 'chorus', label: 'Chorus' },
          { value: 'orchestra', label: 'Orchestra' },
          { value: 'band', label: 'Band' },
          { value: 'theater', label: 'Theater' },
          { value: 'dance', label: 'Dance' }
        ]
      }
    },
    created() {
      this.supabase = createClient(
        process.env.VUE_APP_SUPABASE_URL,
        process.env.VUE_APP_SUPABASE_ANON_KEY
      )
      console.log('Supabase client initialized:', this.supabase)
    },
    methods: {
      async authenticate() {
        if (this.password === process.env.VUE_APP_ADMIN_PASSWORD) {
          this.isAuthenticated = true
          await this.fetchMembers()
        } else {
          alert('Incorrect password')
        }
      },
      async fetchMembers() {
        try {
          const { data, error } = await this.supabase
            .from('memberships')
            .select('*')
            .eq('payment_status', 'paid') // Only fetch paid members
          if (error) throw error
          this.members = data.map(member => {
            if (member.children && typeof member.children === 'string') {
              member.children = JSON.parse(member.children);
              member.children = member.children.map(child => ({
                ...child,
                performingArts: child.performingArts ? child.performingArts.split(', ') : []
              }));
            }
            return member;
          });
          console.log('Fetched paid members:', this.members)
        } catch (error) {
          console.error('Error fetching paid members:', error)
          alert('Failed to fetch paid members. Please check the console for details.')
        }
      },
      openModal(mode, member = null) {
        this.modalMode = mode
        if (mode === 'edit' && member) {
          this.currentMember = JSON.parse(JSON.stringify(member))
          if (this.currentMember.children) {
            this.currentMember.children = this.currentMember.children.map(child => ({
              ...child,
              performingArts: Array.isArray(child.performingArts) ? child.performingArts : (child.performingArts ? child.performingArts.split(', ') : [])
            }))
          }
        } else {
          this.resetCurrentMember()
        }
        this.showModal = true
      },
      closeModal() {
        this.showModal = false
        this.resetCurrentMember()
      },
      resetCurrentMember() {
        this.currentMember = {
          full_name: '',
          address: '',
          email: '',
          phone: '',
          member_type: '',
          children: []
        }
      },
      addChild() {
        if (!Array.isArray(this.currentMember.children)) {
          this.currentMember.children = [];
        }
        this.currentMember.children.push({
          name: '',
          grade: '',
          performingArts: []
        });
      },
      removeChild(index) {
        this.currentMember.children.splice(index, 1)
      },
      async saveMember() {
        try {
          let result
          const memberData = JSON.parse(JSON.stringify(this.currentMember))
          
          if (memberData.children && Array.isArray(memberData.children)) {
            memberData.children = memberData.children.map(child => ({
              ...child,
              performingArts: Array.isArray(child.performingArts) ? child.performingArts.join(', ') : (child.performingArts || '')
            }));
            memberData.children = JSON.stringify(memberData.children)
          }
          
          if (this.modalMode === 'edit') {
            result = await this.supabase
              .from('memberships')
              .update(memberData)
              .eq('id', this.currentMember.id)
          } else {
            result = await this.supabase
              .from('memberships')
              .insert(memberData)
          }
          if (result.error) throw result.error
          await this.fetchMembers()
          this.closeModal()
        } catch (error) {
          console.error('Error saving member:', error)
          alert('Failed to save member. Please check the console for details.')
        }
      },
      async deleteMember(id) {
        if (confirm('Are you sure you want to delete this member?')) {
          try {
            const { error } = await this.supabase
              .from('memberships')
              .delete()
              .eq('id', id)
            if (error) throw error
            console.log('Member deleted:', id)
            await this.fetchMembers()
          } catch (error) {
            console.error('Error deleting member:', error)
            alert('Failed to delete member. Please check the console for details.')
          }
        }
      },
      exportToCsv() {
        // Define the fields we want to export
        const fields = ['full_name', 'email', 'member_type', 'address', 'phone'];
        
        // Create CSV header
        let csv = fields.join(',') + '\n';
        
        // Add data rows
        this.members.forEach(member => {
          let row = fields.map(field => {
            let value = member[field] || '';
            // Wrap the value in quotes and escape existing quotes
            return `"${value.toString().replace(/"/g, '""')}"`;
          });
          
          // Add children information if present
          if (member.member_type === 'parent' && member.children && member.children.length) {
            let childrenInfo = member.children.map(child => 
              `${child.name} (Grade: ${child.grade}, Arts: ${this.getPerformingArts(child)})`
            ).join('; ');
            row.push(`"Children: ${childrenInfo}"`);
          } else {
            row.push(''); // Empty column for non-parents
          }
          
          csv += row.join(',') + '\n';
        });
        
        // Create a Blob with the CSV data
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        
        // Create a download link and trigger the download
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'members_export.csv');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      },
      getPerformingArts(child) {
        if (Array.isArray(child.performingArts)) {
          return child.performingArts.join(', ');
        } else if (typeof child.performingArts === 'string') {
          return child.performingArts;
        }
        return '';
      },
      showChildrenModal(member) {
        this.currentMember = { ...member };
        this.showChildrenModalFlag = true;
      },
      closeChildrenModal() {
        this.showChildrenModalFlag = false;
        this.currentMember = {};
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: left;
  }
  
  button {
    margin-right: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
  }
  
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  input, select {
    width: 100%;
    padding: 0.5rem;
  }
  
  fieldset {
    border: 1px solid #ddd;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  fieldset > div {
    margin-bottom: 0.5rem;
  }
  
  .modal-content table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  
  .modal-content th,
  .modal-content td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: left;
  }
  
  .modal-content th {
    background-color: #f2f2f2;
  }

  .children-link {
    margin-left: 0.5rem;
    font-size: 0.9em;
    color: #007bff;
    text-decoration: none;
  }

  .children-link:hover {
    text-decoration: underline;
  }

  .action-buttons {
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;
  }

  .action-buttons button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .action-buttons button:hover {
    background-color: #0056b3;
  }
  </style>