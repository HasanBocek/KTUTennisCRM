import { GroupData } from '$lib/assets/data/mock/data';

export function load({params}) {
    if (params.id) {
        // Find the group by ID from mock data
        const group = GroupData.find(g => g._id === params.id);
        
        return {
            id: params.id,
            group: group || null
        };
    } 

    return {
        id: null,
        group: null
    };
}