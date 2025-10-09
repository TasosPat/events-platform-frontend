import api from "./axiosInstance";

export async function getEvents() {
  const res = await api.get("/events");
  return res.data;
}

export async function getEventById(id: number) {
  const res = await api.get(`/events/${id}`);
  return res.data;
}

export async function attendEvent(id: number) {
  const res = await api.post(`/events/${id}/attendances`);
  return res.data;
}
