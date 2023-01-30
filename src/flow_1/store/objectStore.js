import {create} from "zustand";

export const useObjectStore = create((set) => ({
    objects: {},
    fetchObject: async (url) => {
        const response = await fetch('https://dummyjson.com/products/1')
        set({objects: await response.json()})
    },
}))