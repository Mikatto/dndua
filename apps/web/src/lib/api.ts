import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export const api = axios.create({ baseURL });
export async function fetchList(edition: "2014"|"2024", kind:"races"|"classes"|"spells"|"features"){
  const { data } = await api.get(`/srd/${edition}/${kind}`); return data as any[];
}
