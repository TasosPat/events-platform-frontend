import api from "./axiosInstance";

export async function getCurrentUser() {
  const res = await api.get("/users/me");
  return res.data;
}

export async function getMyAttendances(id: number) {
    const res = await api.get(`/attendances/users/${id}`);
    return res.data;
  }

  export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
    description?: string;
  }) 
  {
    const res = await api.post("/users", data);
    return res.data;
  };

  export async function updateUser(data: {
    displayName?: string; 
    email?: string; 
    description?: string;
  })
  {
    const res = await api.patch("/users", data);
    return res.data;
  }