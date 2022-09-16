import { writable } from "svelte/store";

export const guilds = writable([]);
export const guildInfo = writable(null);
export const guildMembers = writable([]);
export const guildLoading = writable(false);
export const guildOpponentInfo = writable(null);