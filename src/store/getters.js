export default {
    getAllTrips: (state) => {
        return state.trips;
    },
    getToken: (state) => {
        return state.token;
    },
    getApiBaseUrl: (state) => {
        return state.apiBaseUrl;
    },

}
