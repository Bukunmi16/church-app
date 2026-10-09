import { create } from "zustand";

import { getChurchInfo } from "@/api/settings.api";

export const useChurchInfoStore = create((set) => ({
    churchInfo: {},
    
    fetchChurchInfo: async () => {
        try{
            const {data: churchData} = await getChurchInfo()
            // console.log(churchData);

            set({churchInfo: churchData.churchInfo})
        }catch{
            set({churchInfo: null})
        }
    }
}))