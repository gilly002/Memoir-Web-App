//profile page

// document.getElementById('edit-btn').addEventListener('click', function() {
//     document.getElementById('edit-form').style.display = 'block';
// });

document.getElementById('change-pic-btn').addEventListener('click', function() {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-pic').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});




// This is for the Like Button
document.querySelectorAll('.like-btn').forEach((Likebutton) => {
    Likebutton.addEventListener('click', (event) => {
        const likeButCount = event.target.nextElementSibling;
        let curLikes = parseInt(likeButCount.textContent);
        likeButCount.textContent = `${++curLikes} Likes`;
    });
});

// This is for the comment button that handles it.
// document.querySelectorAll('.cmnt-button').forEach((commentbutton) => {
//     commentbutton.addEventListener('click', () => {
//         alert("Comment is uploading!");
//     });
// });

// This handles the post submission.
const blog_Form = document.querySelector('.addblog form');
if (blog_Form) {
    blog_Form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('blogtitle').value;
        const content = document.getElementById('blogcontent').value;
        const img = document.getElementById('blogimg').files[0];

        if (title && content) {
            alert('Blog post submitted!');

            // It prepares the form data to send to the server
            const frmData = new FormData();
            frmData.append('title', title);
            frmData.append('content', content);
            if (img) {
                frmData.append('image', img);
            }

            // This is to send the form data to the server through fetch API
            fetch('https://(put the server URL here).com/api/blogs', {
                method: 'POST',
                body: frmData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Blog Post Submitted!');
                    blog_Form.reset();
                } else {
                    alert('Error: Could not submit the blog post, Retry.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An Error Occurred While Submitting.');
            });

        } else {
            alert('Please fill in the required fields!');
        }
    });
}

// This is for the login form validation
const login_Form = document.getElementById('loginform');
if (login_Form) {
    login_Form.addEventListener('submit', (event) => {
        event.preventDefault();
        const user_name = document.getElementById('username').value;
        const dpassword = document.getElementById('password').value;

        if (user_name === 'user' && dpassword === 'password') {
            alert('Login was successful!');
            window.location.href = 'profile.html';
        } else {
            document.getElementById('wrong input').textContent = 'Input of Incorrect username or password!';
        }
    });
}

// This is for the signup form validation
const signup_Form = document.getElementById('signupform');
if (signup_Form) {
    signup_Form.addEventListener('submit', (event) => {
        event.preventDefault();
        const dpassword = document.getElementById('password').value;
        const confirm_password = document.getElementById('confirmpassword').value;

        if (dpassword !== confirm_password) {
            document.getElementById('wrong input').textContent = 'The Passwords do not match!';
        } else {
            alert('Sign up successful!');
            // write code to handle signup logic here
        }
    });
}

// Memory Posting Functionality
const memory_Form = document.querySelector('#forms for memories');
if (memory_Form) {
    memory_Form.addEventListener('submit', (event) => {
        event.preventDefault();
        const memory_Content = memory_Form.querySelector('textarea').value;
        const memory_Image = memory_Form.querySelector('input[type="file"]').files[0];

        if (memory_Content && memory_Image) {
            alert('Memory posted!');

            // To Create a FormData object
            const form_Data = new FormData();
            form_Data.append('content', memory_Content);
            form_Data.append('media', memory_Image);

            // To show the memory locally on the page
            const memory_show = document.querySelector('#memory-show');
            const new_Memory = document.createElement('div');
            new_Memory.classList.add('memory-item');

            const memory_Text = document.createElement('p');
            memory_Text.textContent = memory_Content;

            const memory_Media = document.createElement('img');
            memory_Media.src = URL.createObjectURL(memory_Image);
            memory_Media.alt = 'Memory Image';
            memory_Media.style.maxWidth = '100px';

            new_Memory.appendChild(memory_Text);
            new_Memory.appendChild(memory_Media);
            memory_show.appendChild(new_Memory);

            // This is to send the memory data to the server
            fetch('https://(put the server URL here)/api/memories', {
                method: 'POST',
                body: form_Data
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Memory saved to the server successfully!');
                    memory_Form.reset();
                } else {
                    alert('Error: Could not save memory. Please Retry.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An Error Occurred While Saving The Memory.');
            });
            
        } else {
            alert('Please fill in the required fields including image or video!');
        }
    });
}

// This is for the search function
const search_Form = document.querySelector('#form search');
if (search_Form) {
    search_Form.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = search_Form.querySelector('input').value;
        
        if (query) {
            alert(`Searching for: ${query}`);
            const Display_results = document.querySelector('#search-results');
            Display_results.innerHTML = '<p>Searching...</p>';

            fetch(`https://(put the server URL here))/api/search?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    Display_results.innerHTML = '';

                    if (data.results && data.results.length > 0) {
                        data.results.forEach(result => {
                            const result_Item = document.createElement('div');
                            result_Item.classList.add('result-item');

                            const dtitle = document.createElement('h3');
                            dtitle.textContent = result.dtitle;

                            const description = document.createElement('p');
                            description.textContent = result.description;

                            result_Item.appendChild(dtitle);
                            result_Item.appendChild(description);
                            Display_results.appendChild(result_Item);
                        });
                    } else {
                        Display_results.innerHTML = '<p>No result found.</p>';
                    }
                })
                .catch(error => {
                    console.error('Search error:', error);
                    Display_results.innerHTML = '<p>Error occurred while searching. Please Retry.</p>';
                });
        } else {
            alert('Enter a search query!');
        }
    });
}
