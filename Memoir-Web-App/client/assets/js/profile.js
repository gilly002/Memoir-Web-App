document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token not found!');
        window.location.href = '/login'; // Redirect if not logged in
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const user = await response.json();
        renderUserProfile(user);
        updateProfileTab(user.profPics); // Update the profile tab with the user's picture
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
});



function renderUserProfile(user) {
    const profileContainer = document.querySelector('.profile-container');

    // Using template literals to create the profile HTML
    profileContainer.innerHTML = `
        <div class="profile-header">
            <h2>User Profile</h2>
        </div>
        <div class="profile-pic-section">
            <img id="profile-pic" src="http://localhost:5000${user.profPics || 'http://localhost:5000/uploads/profilePic/defaultUser.png'}" alt="Profile Picture">
            <button id="change-pic-btn">Change Picture</button>
            <input type="file" id="file-input" accept="image/*" style="display: none;">
            <button id="save-pic-btn" style="display: none;">Save Picture</button> <!-- Save button for the image -->
        </div>
        <div class="profile-info">
            <p><strong>Username:</strong> <span id="username">${user.username}</span></p>
            <p><strong>Email:</strong> <span id="email">${user.email}</span></p>
            <p><strong>Bio:</strong></p>
            <p id="bio">${user.bio || 'No bio available.'}</p>
            <button id="edit-btn">Edit Profile</button>
        </div>
        <div class="edit-profile-form" id="edit-form" style="display: none;">
            <h3>Edit Profile</h3>
            <label for="edit-username">Username:</label>
            <input type="text" id="edit-username" value="${user.username}">
            
            <label for="edit-email">Email:</label>
            <input type="email" id="edit-email" value="${user.email}">
            
            <label for="edit-bio">Bio:</label>
            <input type="text" id="edit-bio" value="${user.bio || ''}">
            
            <button id="save-btn">Save Changes</button>
        </div>
    `;

    // Attach event listeners after rendering the profile
    attachEventListeners();
}

function updateProfileTab(profilePicUrl) {
    const profilePicTab = document.getElementById('profile-pic-tab');
    if (profilePicTab) {
        profilePicTab.src = profilePicUrl || 'http://localhost:5000/uploads/profilePic/defaultUser.png';
    } else {
        console.error('Profile picture tab not found!');
    }
}

function attachEventListeners() {
    document.getElementById('edit-btn').addEventListener('click', () => {
        document.getElementById('edit-form').style.display = 'block';
    });

    document.getElementById('save-btn').addEventListener('click', async (event) => {
        event.preventDefault();
        await saveProfileChanges();
    });

    document.getElementById('change-pic-btn').addEventListener('click', () => {
        document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('profile-pic').src = e.target.result; // Show selected image
                document.getElementById('save-pic-btn').style.display = 'block'; // Show save button
            };
            reader.readAsDataURL(file);
        }
    });

    // Save profile picture
    document.getElementById('save-pic-btn').addEventListener('click', async () => {
        const fileInput = document.getElementById('file-input');
        if (!fileInput.files[0]) {
            console.error('No file selected for saving');
            return;
        }

        const token = localStorage.getItem('token');
        let userId;

        try {
            const decodedToken = jwt_decode(token);
            userId = decodedToken.id;
        } catch (error) {
            console.error('Failed to decode token:', error);
            window.location.href = '/login'; // Redirect to login if token is invalid
            return;
        }

        const formData = new FormData();
        formData.append('profPics', fileInput.files[0]); // Add the selected file to form data

        try {
            const response = await fetch(`http://localhost:5000/user/edituser/${userId}`, {
                method: 'PATCH',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Failed to update profile picture:', errorMessage);
                throw new Error('Failed to update profile picture');
            }

            const updatedUser = await response.json();
            document.getElementById('profile-pic').src = `http://localhost:5000${updatedUser.profPics}?t=${new Date().getTime()}` || 'http://localhost:5000/uploads/profilePic/defaultUser.png';
            document.getElementById('save-pic-btn').style.display = 'none'; // Hide save button after saving
            console.log('Profile picture updated successfully');
        } catch (error) {
            console.error('Error saving profile picture:', error);
        }
    });
}

async function saveProfileChanges() {
    const token = localStorage.getItem('token');
    let userId;

    try {
        const decodedToken = jwt_decode(token);
        userId = decodedToken.id;
    } catch (error) {
        console.error('Failed to decode token:', error);
        window.location.href = '/login'; // Redirect to login if token is invalid
        return;
    }

    const formData = new FormData();
    formData.append('username', document.getElementById('edit-username').value);
    formData.append('email', document.getElementById('edit-email').value);
    formData.append('bio', document.getElementById('edit-bio').value);

    const fileInput = document.getElementById('file-input');
    if (fileInput.files[0]) {
        formData.append('profPics', fileInput.files[0]); // Ensure the key matches your backend
    }

    try {
        const response = await fetch(`http://localhost:5000/user/edituser/${userId}`, {
            method: 'PATCH',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Failed to update profile:', errorMessage);
            throw new Error('Failed to update profile');
        }

        const updatedUser = await response.json();
        renderUserProfile(updatedUser); // Re-render the profile with updated data
        document.getElementById('edit-form').style.display = 'none'; // Hide edit form after save
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}