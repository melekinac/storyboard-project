import { writable } from "svelte/store";

// Kullanıcı bilgilerini saklamak için bir store oluşturuyoruz
export const userStore = writable({
  people_id: null,
  people_nickname: "",
  people_email: "",
});
