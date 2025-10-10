import api from "./axiosInstance";

export async function getCurrentUser() {
  const res = await api.get("/users/me");
  return res.data;
}

export async function getMyAttendances(id: number) {
    const res = await api.get(`/attendances/users/${id}`);
    return res.data;
  }