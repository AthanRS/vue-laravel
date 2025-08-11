<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const emailVerified = ref(false);
const message = ref("");
const loading = ref(true);
let intervalId = null;

const checkVerification = async () => {
  emailVerified.value = await authStore.checkEmailVerified();
  if (emailVerified.value) {
    clearInterval(intervalId);
    message.value = "Email verified! Redirecting...";
    setTimeout(() => router.push({ name: "dashboard" }), 1500);
  }
};

const resendEmail = async () => {
  const success = await authStore.resendVerificationEmail();
  message.value = success
    ? "Verification email resent successfully."
    : "Failed to resend. Please try again.";
};

onMounted(async () => {
  await checkVerification();
  loading.value = false;
  intervalId = setInterval(checkVerification, 10000);
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">
      <h1 class="text-2xl font-bold text-indigo-600 mb-4">Verify Your Email</h1>
      <p class="text-gray-700 mb-2">
        Please check your inbox and click the verification link.
      </p>
      <p v-if="message" class="text-green-500 mb-4">{{ message }}</p>
      <button @click="resendEmail" class="primary-btn px-6 py-2">
        Resend Verification Email
      </button>
    </div>
  </div>
</template>

<style scoped>
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