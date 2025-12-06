document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      window.location.href = '/pages/login.html'; // No token, redirect to login
    } else {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
  
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (payload.exp < currentTime) {
        localStorage.removeItem('token'); // Remove expired token
        window.location.href = '/pages/login.html'; // Redirect to login
      }
    }
  });
  