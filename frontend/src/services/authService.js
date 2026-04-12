const authService = {
  getUser: () => JSON.parse(localStorage.getItem('user')),
  isLoggedIn: () => !!localStorage.getItem('user'),
  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role === 'ADMIN';
  },
  logout: () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export default authService;