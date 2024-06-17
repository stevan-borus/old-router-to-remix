const fakeAuthProvider = {
  isAuthenticated: false,
  async signin(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@admin.com' && password === 'admin') {
      fakeAuthProvider.isAuthenticated = true;
      return email;
    }

    throw new Error('Invalid credentials');
  },
  signout() {
    fakeAuthProvider.isAuthenticated = false;
  },
};

export { fakeAuthProvider };
