import api from "./axiosInstance";
import { NewEvent } from "../types/event";

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

export async function unattendEvent(id: number) {
  const res = await api.delete(`/events/${id}/attendances`);
  return res.data;
}

export async function getEventAttendees(id: number) {
  const res = await api.get(`/attendances/events/${id}`);
  return res.data;
}

export async function createEvent(eventData: NewEvent ) {
  const res = await api.post(`/admin/create-staff`, eventData);
  return res.data;
}
