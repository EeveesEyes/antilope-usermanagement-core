import ky from 'ky';

export default {
    setToken: ({commit}, payload) => {
        commit('setToken', payload);
    },
    async getToken(none, {email, password}) {
        try {
            const response = await ky.post('http://localhost:8000/api/users/login',
                {json: {user: {email: email, password: password}}});
            return response.json();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('token error', e)
            if (e.message === 'Bad Request') {
                throw e;
            } else {
                // eslint-disable-next-line no-console
                console.log('ky.post', e);
            }
        }
    },
    async login({dispatch, commit}, data) {
        let result = await dispatch('getToken', {email: data.email, password: data.password})
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.log('login error', e)
                throw e
            });
        // eslint-disable-next-line no-console
        console.log('payload', result);
        commit('setToken', result.user);
    }
}