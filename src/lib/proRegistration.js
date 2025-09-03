const KEY = "pro_salon_id";
export const saveSalonId = (id) => localStorage.setItem(KEY, String(id));
export const getSalonId  = () => (localStorage.getItem(KEY) ? Number(localStorage.getItem(KEY)) : null);
export const clearSalonId = () => localStorage.removeItem(KEY);
