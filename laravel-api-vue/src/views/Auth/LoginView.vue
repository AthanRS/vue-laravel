<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";

const authStore = useAuthStore();
const { errors } = storeToRefs(authStore);
const { loginAuth } = authStore;

const formData = reactive({
  email: "",
  password: "",
});

const loading = ref(false); // Loading state

onMounted(() => (errors.value = {}));

const handleLogin = async () => {
  errors.value = {};
  loading.value = true; // Start loading

  await loginAuth("login", formData);

  loading.value = false; // Stop loading
};
</script>

<template>
  <main>
    <h1 class="title">Login to your account</h1>
    <form @submit.prevent="handleLogin" class="w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Email" v-model="formData.email" />
        <p v-if="errors.email" class="error">{{ errors.email[0] }}</p>
      </div>
      <div>
        <input type="password" placeholder="Password" v-model="formData.password" />
        <p v-if="errors.password" class="error">{{ errors.password[0] }}</p>
      </div>

      <button class="primary-btn flex items-center justify-center gap-2" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        <span>{{ loading ? "Logging in..." : "Login" }}</span>
      </button>
    </form>
  </main>
</template>

<style scoped>
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

/* Spinner styles */
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