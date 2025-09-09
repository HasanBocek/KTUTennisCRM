import { GroupData } from '$lib/assets/data/mock/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
    const { user } = await parent();

    if (params.id) {
        const group = GroupData.find((g) => g._id === params.id) || null;
        return {
            user,
            id: params.id,
            group
        };
    }

    return {
        user,
        id: null,
        group: null
    };
};