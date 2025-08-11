<script setup>
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();
const users = ref([]);
const showModal = ref(false);
const editForm = ref({ id: null, name: '', email: '' });

onMounted(async () => {
  users.value = await userStore.getAllUser();
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const openEditModal = (user) => {
  editForm.value = { ...user }; // clone user data
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editForm.value = { id: null, name: '', email: '' };
};

const saveEdit = async () => {
  await userStore.updateUser(editForm.value);
  users.value = await userStore.getAllUser(); // refresh
  closeModal();
};

const deleteUser = async (id) => {
  if (confirm("Are you sure you want to delete this user?")) {
    await userStore.deleteUser(id);
    users.value = await userStore.getAllUser();
  }
};
</script>

<template>
  <main class="p-4 sm:p-6">
    <h1 class="text-xl sm:text-2xl font-bold mb-4">User Management</h1>

    <!-- TABLE for md and up -->
    <div v-if="users.length > 0">
    <!-- Table layout for larger screens -->
    <div class="overflow-x-auto border rounded-lg hidden sm:block">
        <table class="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
        <thead class="bg-gray-100">
            <tr>
            <th class="px-4 py-2 text-left">ID</th>
            <th class="px-4 py-2 text-left">Name</th>
            <th class="px-4 py-2 text-left">Email</th>
            <th class="px-4 py-2 text-left">Date Created</th>
            <th class="px-4 py-2 text-left">Actions</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">{{ user.id }}</td>
            <td class="px-4 py-2">{{ user.name }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">{{ formatDate(user.created_at) }}</td>
            <td class="px-4 py-2 space-x-2">
                <button class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                @click="openEditModal(user)">Edit</button>
                <button class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                @click="deleteUser(user.id)">Delete</button>
            </td>
            </tr>
        </tbody>
        </table>
    </div>

    <!-- CARD layout for mobile -->
    <div class="sm:hidden space-y-4">
        <div v-for="user in users" :key="user.id" class="border rounded-lg p-4 shadow bg-white">
        <div class="mb-2">
            <p class="text-gray-500 text-sm">ID</p>
            <p class="font-medium">{{ user.id }}</p>
        </div>
        <div class="mb-2">
            <p class="text-gray-500 text-sm">Name</p>
            <p class="font-medium">{{ user.name }}</p>
        </div>
        <div class="mb-2">
            <p class="text-gray-500 text-sm">Email</p>
            <p class="font-medium">{{ user.email }}</p>
        </div>
        <div class="mb-4">
            <p class="text-gray-500 text-sm">Date Created</p>
            <p class="font-medium">{{ formatDate(user.created_at) }}</p>
        </div>
        <div class="flex justify-end space-x-2">
            <button class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            @click="openEditModal(user)">Edit</button>
            <button class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            @click="deleteUser(user.id)">Delete</button>
        </div>
        </div>
    </div>
    </div>

    <div v-else>
      <p class="text-gray-600">No users found.</p>
    </div>

    <!-- Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-lg w-full sm:max-w-sm md:max-w-md shadow-lg">
        <h2 class="text-lg sm:text-xl font-bold mb-4">Edit User</h2>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Name</label>
          <input v-model="editForm.name" type="text"
                 class="w-full border px-3 py-2 rounded text-sm sm:text-base" />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Email</label>
          <input v-model="editForm.email" type="email"
                 class="w-full border px-3 py-2 rounded text-sm sm:text-base" />
        </div>

        <div class="flex flex-col sm:flex-row justify-end sm:space-x-2 space-y-2 sm:space-y-0">
          <button @click="closeModal"
                  class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm sm:text-base">
            Cancel
          </button>
          <button @click="saveEdit"
                  class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm sm:text-base">
            Save
          </button>
        </div>
      </div>
    </div>
  </main>
</template>