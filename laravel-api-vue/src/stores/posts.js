import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const usePostsStore = defineStore('postStore',{
    state: ()=>{
        return {
            errors: {}
        }
    },

    actions: {
        //Enable this if Title duplicates is not allowed
        async isTitleDuplicate(title) {
            try {
            const res = await fetch(`/api/posts/check-title?title=${encodeURIComponent(title)}`);
            if (!res.ok) throw new Error('Failed to check title');

            const data = await res.json();
            return data.exists === true;
            } catch (error) {
            console.error('Title check error:', error);
            return false;
            }
        },

        async createPost(formData) {
            this.errors = {};

            const duplicate = await this.isTitleDuplicate(formData.title);
            if (duplicate) {
            this.errors = { title: ['This title already exists. Please choose another.'] };
            return;
            }

            const res = await fetch('/api/posts', {
            method: 'post',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.errors) {
            this.errors = data.errors;
            } else {
            this.router.push({ name: 'home' });
            }
        },


        //Enable this if Title duplicates allowed
        /* async createPost(formData){
            const res = await fetch('/api/posts',{
                method: 'post',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json();
            if (data.errors) {
                this.errors = data.errors;
            } else {
                this.router.push({name:"home"});
            }
        },
 */
        //Get all posts
        async getAllPosts() {
            try {
                const res = await fetch('/api/posts');

                // If not OK (like 500), throw error
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Server Error: ${res.status} - ${errorText}`);
                }

                const data = await res.json(); // Now safe
                return data;
            } catch (error) {
                console.error("Failed to fetch posts:", error.message);
                return []; // Return empty array as fallback
            }
        },
        //Get a post
        async getPost(post){
            const res = await fetch(`/api/posts/${post}`);
            const data = await res.json()

            return data.post;
        },





        // Soft-delete post
        async deletePost(post) {
            const authStore = useAuthStore();
            if (authStore.user.id === post.user_id) {
                try {
                    const response = await fetch(`/api/posts/${post.id}`, {
                        method: 'PUT', // MUST be PUT to match apiResource
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ status: 'deleted' })
                    });

                    const data = await response.json();
                    console.log('API response:', data);

                    if (response.ok) {
                        this.router.push({ name: 'home' });
                    } else {
                        console.error('Update failed:', data.errors);
                        this.errors = data.errors || {};
                    }
                } catch (error) {
                    console.error('Request error:', error);
                }
            }
        },

        //update post
        async updatePost(post, formData){
            const authStore = useAuthStore()
            if (authStore.user.id === post.user_id) {
                    const res = await fetch (`/api/posts/${post.id}`,{
                    method: "put",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(formData)
                });
                const data = await res.json()
                if (data.errors) {
                    this.errors = data.errors;
                } else {
                    this.router.push({name:"home"});
                    this.errors = {};
                }
            }
        },
    },
});