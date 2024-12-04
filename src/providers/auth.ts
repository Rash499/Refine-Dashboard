import type { AuthProvider } from "@refinedev/core";
//import type { User } from "@/graphql/schema.types";
import { API_URL, dataProvider } from "./data";

export const authCredentials = {
    email: "rashmikadilmin@gmail.com",
    password: "admin1234",
};

export const authProvider: AuthProvider = {
    login: async ({ email }) => {
        try {
            const { data } = await dataProvider.custom({
                url: API_URL,
                method: "post",
                headers: {},
                meta: {
                    variables: { email },
                    rawQuery: `
                        mutation Login($email: String!) {
                            login(loginInput: { email: $email }) {
                                accessToken
                            }
                        }
                    `,
                },
            });

            localStorage.setItem("access_token", data.login.accessToken);

            return {
                success: true,
                redirectTo: "/",
            };
        } catch (error) {
            const e = error as Error;
            return {
                success: false,
                error: {
                    message: e.message || "Login Failed",
                    name: e.name || "Invalid email or password",
                },
            };
        }
    },

    logout: async () => {
        localStorage.removeItem("access_token");
        return {
            success: true,
            redirectTo: "/login", // Fixed typo here
        };
    },

    check: async () => {
        try {
            await dataProvider.custom({
                url: API_URL,
                method: "post",
                headers: {},
                meta: {
                    rawQuery: `
                        query Me {
                            me {
                                id
                                name
                            }
                        }
                    `,
                },
            });

            return {
                authenticated: true,
                redirectTo: "/",
            };
        } catch (error) {
            return {
                authenticated: false,
                redirectTo: "/login",
            };
        }
    },

    getIdentity: async () => {
        const accessToken = localStorage.getItem("access_token");

        try {
            const { data } = await dataProvider.custom<{ me: any }>({
                url: API_URL,
                method: "post",
                headers: accessToken
                    ? {
                          Authorization: `Bearer ${accessToken}`,
                      }
                    : {},
                meta: {
                    rawQuery: `
                        query Me {
                            me {
                                id
                                name
                                email
                                phone
                                jobTitle
                                timezone
                                avatarUrl
                            }
                        }
                    `,
                },
            });

            return data.me;
        } catch (error) {
            console.error("Error in getIdentity:", error);
            return undefined;
        }
    },

    onError: async (error) => {
        if (error.statusCode === "UNAUTHENTICATED") {
            return { logout: true };
        }

        return { error };
    },
};
