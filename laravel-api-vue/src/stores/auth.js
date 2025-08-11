import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        user: null,
        errors: {},
    }),

    actions: {
        // Get authenticated user
        async getUser() {
            if (localStorage.getItem("token")) {
                const res = await fetch("/api/user", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    this.user = data;
                }
            }
        },

        // Login user
        async loginAuth(apiRoute, formData) {
            const res = await fetch(`/api/${apiRoute}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.errors) {
                this.errors = data.errors;
            } else if (res.status === 403 && data.errors?.email?.[0]?.includes('not verified')) {
                //  Block login if email not verified
                this.errors = { email: ["Please verify your email before logging in."] };
            } else {
                this.errors = {};
                localStorage.setItem("token", data.token);
                this.user = data.user;
                this.router.push({ name: "home" });
            }
        },

        // Register user
        async regAuth(apiRoute, formData) {
            const res = await fetch(`/api/${apiRoute}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.errors) {
                this.errors = data.errors;
                return false;
            } else {
                this.errors = {};
                this.user = null;
                localStorage.removeItem("token");
                return true; // Show "check your email" modal
            }
        },

        // Logout user
        async logout() {
            const res = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.ok) {
                this.user = null;
                this.errors = {};
                localStorage.removeItem("token");
                this.router.push({ name: "login" });
            }
        },

        // Check if email is verified
        async checkEmailVerified() {
            const res = await fetch("/api/user", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) return false;

            const data = await res.json();
            return data.email_verified_at !== null;
        },

        // Resend email verification
        async resendVerificationEmail() {
            const res = await fetch("/api/email/resend", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            return res.ok;
        },
    },
});