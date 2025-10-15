export interface NewUser {
    uid: string;
    name: string;
    role: "user" | "staff";
    email: string;
    description?: string;
  }

  export interface User extends NewUser {
    user_id: number;
  }