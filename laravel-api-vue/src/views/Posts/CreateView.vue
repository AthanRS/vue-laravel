<script setup>
import { usePostsStore } from '@/stores/posts';
import { storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';

const postsStore = usePostsStore();
const { errors } = storeToRefs(postsStore);
const { createPost } = postsStore;

const formData = reactive({
  title: "",
  body: "",
});

const loading = ref(false); // Loading state

const handleCreatePost = async () => {
  errors.value = {};
  loading.value = true; // Start loading

  await createPost(formData);

  loading.value = false; // Stop loading
};
</script>

<template>
  <main>
    <h1 class="title">Create a new post</h1>
    <form @submit.prevent="handleCreatePost" class="w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Post Title" v-model="formData.title">
        <p v-if="errors.title" class="error">{{ errors.title[0] }}</p>
      </div>

      <div>
        <textarea rows="6" placeholder="Post Content" v-model="formData.body"></textarea>
        <p v-if="errors.body" class="error">{{ errors.body[0] }}</p>
      </div>

      <button class="primary-btn flex items-center justify-center gap-2" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        <span>{{ loading ? "Creating..." : "Create" }}</span>
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