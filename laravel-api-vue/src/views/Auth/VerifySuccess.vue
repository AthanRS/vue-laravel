<template>
  <main class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="flex flex-col items-center space-y-6 text-center">
      <h1 class="text-2xl font-bold">
        Account successfully verified.
      </h1>
      <RouterLink
        :to="{ name: 'login' }"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Click here to login
      </RouterLink>
    </div>
  </main>
</template>