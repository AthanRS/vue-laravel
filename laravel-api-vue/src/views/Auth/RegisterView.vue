<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";

const authStore = useAuthStore();
const { errors } = storeToRefs(authStore);
const { regAuth } = authStore;

const formData = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const showSuccessModal = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

onMounted(() => {
  errors.value = {};
});

const handleSubmit = async () => {
  errors.value = {};
  loading.value = true;

  const success = await regAuth("register", formData);
  loading.value = false;

  if (success) {
    showSuccessModal.value = true;
    formData.name = "";
    formData.email = "";
    formData.password = "";
    formData.password_confirmation = "";
  }
};

const goToLogin = () => {
  showSuccessModal.value = false;
  authStore.router.push({ name: "login" });
};
</script>

<template>
  <main>
    <h1 class="title">Register a new account</h1>

    <form @submit.prevent="handleSubmit" class="w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Name" v-model="formData.name" class="border p-2 w-full rounded" />
        <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name[0] }}</p>
      </div>

      <div>
        <input type="text" placeholder="Email" v-model="formData.email" class="border p-2 w-full rounded" />
        <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email[0] }}</p>
      </div>

      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          v-model="formData.password"
          class="border p-2 w-full rounded pr-12 h-10"
        />
        <button
          v-if="formData.password"
          type="button"
          @click.stop="showPassword = !showPassword"
          aria-label="Toggle password visibility"
          class="absolute inset-y-0 right-2 flex items-center justify-center px-2"
        >
          <!-- eye open -->
          <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <!-- eye closed -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.29 20.29 0 0 1 4.21-4.21"/>
            <path d="M1 1l22 22"/>
          </svg>
        </button>

        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password[0] }}</p>
      </div>

      <!-- Confirm Password -->
      <div class="relative">
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirm Password"
          v-model="formData.password_confirmation"
          class="border p-2 w-full rounded pr-12 h-10"
        />
        <button
          v-if="formData.password_confirmation"
          type="button"
          @click.stop="showConfirmPassword = !showConfirmPassword"
          aria-label="Toggle confirm password visibility"
          class="absolute inset-y-0 right-2 flex items-center justify-center px-2"
        >
          <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.29 20.29 0 0 1 4.21-4.21"/>
            <path d="M1 1l22 22"/>
          </svg>
        </button>
      </div>

      <!-- Register Button -->
      <button class="primary-btn flex items-center justify-center gap-2" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        <span>{{ loading ? "Registering..." : "Register" }}</span>
      </button>
    </form>

    <!-- SUCCESS MODAL OUTSIDE FORM -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-2">Registration Successful!</h2>
        <p class="mb-4">Please check your email to verify your account before logging in.</p>
        <button @click="goToLogin" class="primary-btn px-6 py-2">OK</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
.primary-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
}
.primary-btn:hover {
  background-color: #4338ca;
}
.primary-btn:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}
.spinner {
  border: 3px solid #fff;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.6s linear infinite;
  background: transparent;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>