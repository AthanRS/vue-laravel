<script setup>
import { useAuthStore } from '@/stores/auth';
import { usePostsStore } from '@/stores/posts';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const {getPost,deletePost} = usePostsStore();
const post = ref(null);
const authStore = useAuthStore();

onMounted(async()=>post.value = await getPost(route.params.id));
</script>
<template>
    <main>
    <div v-if="post">
      <div class="border-l-4 border-blue-500 pl-4 mt-12">
        <h2 class="font-bold text-3xl">{{ post.title }}</h2>
        <p class="text=xs text-slate-600 mb-4">
          Posted by {{ post.user.name }}
        </p>
        <p>
          {{ post.body }}
        </p>
        <div v-if="authStore.user && authStore.user.id === post.user_id" class="flex items-center gap-6 mt-6">
            <form @submit.prevent="deletePost(post)">
                <button class="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </form>

            <RouterLink :to="{name: 'update', params: {id:post.id}}" class="px-3 py-1 bg-green-500 text-white rounded">Update</RouterLink>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="title">Page not found!</h2>
    </div>
    </main>
</template>