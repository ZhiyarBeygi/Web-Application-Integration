import axiosClient from "./axiosClient";

export function getTenders() {
  return axiosClient.get("/Tenders");
}

export function getTenderById(id) {
  return axiosClient.get(`/Tenders/${id}`);
}

export function searchTenders(term) {
  return axiosClient.get(
    `/Tenders/search?term=${encodeURIComponent(term)}`
  );
}

export function createTender(tender) {
  return axiosClient.post("/Tenders", tender);
}

export function updateTender(id, tender) {
  return axiosClient.put(`/Tenders/${id}`, tender);
}

export function deleteTender(id) {
  return axiosClient.delete(`/Tenders/${id}`);
}