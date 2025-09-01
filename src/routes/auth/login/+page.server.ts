import { type Action, fail, redirect, json } from '@sveltejs/kit';

const defaultUser = {
	email: 'user@demo.com',
	password: '123456'
};

const login: Action = async ({ cookies, request }) => {
	const data = await request.formData();
	const email = data.get('email');
	const password = data.get('password');

	if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
		return fail(400, { invalid: true });
	}

	if (email !== defaultUser.email) {
		return fail(400, { credentials: true });
	}

	if (password !== defaultUser.password) {
		return fail(400, { credentials: true });
	}

	cookies.set('user', defaultUser.email, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 30
	});

	return json({ redirect: '/dashboard/profile' });
};

export const actions = { login };