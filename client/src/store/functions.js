export const pendingCase = (state) => {
    state.isLoading = true;
    state.error = null;
};
export const rejectedCase = (state, action) => {
    state.error = action.payload;
    state.isLoading = false;
};
export const fulfilledCase = (state, action) => {
    state.isLoading = false;
    state.error = null;
    state.user = action.payload;
};