import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
  }),

  actions: {
    //get users
    async getAllUser() {
      const res = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      this.users = data;
      return data;
    },

    //delete user
    async deleteUser(id) {
      await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    },


    //update User
    async updateUser(user) {
        const res = await fetch(`/api/users/${user.id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
            name: user.name,
            email: user.email,
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Update failed');
        }
    }
    
  }
});