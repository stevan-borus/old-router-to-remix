const fakeAuthProvider = {
  isAuthenticated: false,
  async signin(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@admin.com' && password === 'admin') {
      fakeAuthProvider.isAuthenticated = true;
      return true;
    }

    return false;
  },
  signout() {
    fakeAuthProvider.isAuthenticated = false;
  },
};

export { fakeAuthProvider };
