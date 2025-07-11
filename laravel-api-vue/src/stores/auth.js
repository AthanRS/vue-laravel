import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore",{
    state: () => {
        return {
            user: null,
            errors:{},
        };
    },

    actions: {
        //get authenticated user
        async getUser() {
            if (localStorage.getItem("token")){
                const res = await fetch("/api/user",{
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                if (res.ok){
                    this.user = data;
                }
            }
        },


        //login user
        async loginAuth(apiRoute, formData) {
            const res = await fetch(`/api/${apiRoute}`, {
                method: "post",
                body: JSON.stringify(formData),
            })

            const data = await res.json();
            if (data.errors){
                this.errors = data.errors
            } else{
                this.errors = {}
                localStorage.setItem('token',data.token)
                this.user = data.user
                this.router.push({name: 'home'});
            }
            
        },

        //register user
        async regAuth(apiRoute, formData) {
            const res = await fetch(`/api/${apiRoute}`, {
                method: "post",
                body: JSON.stringify(formData),
                headers: {
                "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (data.errors) {
                this.errors = data.errors;
                return false; 
            } else {
                this.errors = {};
                this.user = null;
                localStorage.removeItem("token");
                return true; 
            }
        },

        //logout user
        async logout(){
            const res = await fetch('api/logout',{
                method: 'post',
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            const data = await res.json()
            console.log(data) 

            if (res.ok) {
                this.user = null
                this.errors = {}
                localStorage.removeItem('token')
                this.router.push({name:"home"});
            }
        },

    },
})