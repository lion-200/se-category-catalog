export const initialState: IState = {
  $action: {
    name: '',
    params: {}
  },
  account: {
    name: '',
    token: {},
    account: {},
    notifications: []
  },
  firebaseUser: {},
  loggedIn: false,
  loading: false
};
