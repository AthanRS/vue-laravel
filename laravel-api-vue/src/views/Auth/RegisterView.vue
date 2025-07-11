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

onMounted(() => {
  errors.value = {};
});

const handleSubmit = async () => {
  errors.value = {};
  const success = await regAuth("register", formData);

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
        <input type="text" placeholder="Name" v-model="formData.name" />
        <p v-if="errors.name" class="error">{{ errors.name[0] }}</p>
      </div>
      <div>
        <input type="text" placeholder="Email" v-model="formData.email" />
        <p v-if="errors.email" class="error">{{ errors.email[0] }}</p>
      </div>
      <div>
        <input type="password" placeholder="Password" v-model="formData.password" />
        <p v-if="errors.password" class="error">{{ errors.password[0] }}</p>
      </div>
      <div>
        <input type="password" placeholder="Confirm Password" v-model="formData.password_confirmation" />
      </div>
      <button class="primary-btn">Register</button>
    </form>

    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-2">Registration Successful!</h2>
        <p class="mb-4">Your account has been created.</p>
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
}
.primary-btn:hover {
  background-color: #4338ca;
}
</style>