import { writable } from "svelte/store";

export const userStore = writable({
  people_id: null,
  people_nickname: "",
  people_email: "",
});
