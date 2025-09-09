import { UserData } from '$lib/assets/data/mock/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
    const { user } = await parent();

    if (params.id) {
        const targetUser = UserData.find((u) => u._id === params.id) || null;

        return {
            user,
            id: params.id,
            targetUser
        };
    }

    return {
        user,
        id: null,
        targetUser: null
    };
};