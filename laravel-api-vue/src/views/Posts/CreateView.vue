<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">User Management</h1>

    <!-- Create Form -->
    <form @submit.prevent="addUser" class="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <input v-model="newUser.name" type="text" placeholder="Name" class="px-4 py-2 border rounded" required />
      <input v-model="newUser.email" type="email" placeholder="Email" class="px-4 py-2 border rounded" required />
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add User</button>
    </form>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Created At</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="(user, index) in users" :key="index" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <span v-if="!user.editing">{{ user.name }}</span>
              <input v-else v-model="user.name" class="border rounded px-2 py-1" />
            </td>
            <td class="px-6 py-4">
              <span v-if="!user.editing">{{ user.email }}</span>
              <input v-else v-model="user.email" class="border rounded px-2 py-1" />
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(user.createdAt) }}</td>
            <td class="px-6 py-4 space-x-2">
              <button
                v-if="!user.editing"
                @click="editUser(user)"
                class="text-blue-600 hover:underline"
              >Edit</button>
              <button
                v-else
                @click="saveUser(user)"
                class="text-green-600 hover:underline"
              >Save</button>
              <button
                @click="deleteUser(index)"
                class="text-red-600 hover:underline"
              >Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const newUser = reactive({
  name: '',
  email: ''
})

const users = reactive([
  { name: 'Jane Doe', email: 'jane@example.com', createdAt: new Date(), editing: false },
  { name: 'John Smith', email: 'john@example.com', createdAt: new Date(), editing: false }
])

function addUser() {
  if (!newUser.name || !newUser.email) return
  users.push({
    name: newUser.name,
    email: newUser.email,
    createdAt: new Date(),
    editing: false
  })
  newUser.name = ''
  newUser.email = ''
}

function deleteUser(index) {
  users.splice(index, 1)
}

function editUser(user) {
  user.editing = true
}

function saveUser(user) {
  user.editing = false
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date)
}
</script>