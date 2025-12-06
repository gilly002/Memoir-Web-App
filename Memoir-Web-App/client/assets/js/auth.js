document.addEventListener('DOMContentLoaded', () => {
  // Signup form handler
  document.getElementById('signup-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      if (password !== confirmPassword) {
          document.getElementById('wrong-input').innerText = "Passwords don't match!";
          return;
      }

      const userData = { username, email, password };

      try {
          const response = await fetch('http://localhost:5000/user/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (response.ok) {
            localStorage.setItem('token', data.token);
            alert('Sign up successful!');
            window.location.href = '/pages/login.html'; // Redirect after signup
          } else {
            document.getElementById('wrong-input').innerText = data.message;
          }
      } catch (error) {
          console.error('Error:', error);
      }
  });
});

  // Login form handler
document.addEventListener('DOMContentLoaded', () => {
  console.log('Script loaded');
  document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userData = { username, password };

    try {
      const response = await fetch('http://localhost:5000/user/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
      });

      const data = await response.json();

      console.log('Response data:', data);

      if (response.ok) {
          localStorage.setItem('token', data.token);
          alert('Login was successful!');
          window.location.href = '/pages/posts.html';
      } else {
          document.getElementById('wrong-input').innerText = data.message;
      }
  } catch (error) {
      console.error('Error:', error);
  }
  });
});



