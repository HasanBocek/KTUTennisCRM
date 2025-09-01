import { UserData } from '$lib/assets/data/mock/data';

export function load({params}) {
    if (params.id) {
        // Find the user by ID from mock data
        const user = UserData.find(u => u._id === params.id);
        
        return {
            id: params.id,
            user: user || null
        };
    } 

    return {
        id: null,
        user: null
    };
}