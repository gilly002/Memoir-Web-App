// Fetch and display all memories when the page loads
// Fetch and display all memories when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  await fetchMemories();
});

// Function to fetch all memories from the server
async function fetchMemories() {
  try {
    const response = await fetch('http://localhost:5000/posts');
    if (!response.ok) {
      throw new Error('Failed to fetch memories');
    }
    const { data: memories } = await response.json();

    console.log('Fetched Memories:', memories);

    // Display each memory
    memories.forEach(memory => {
      displayMemory(memory);
    });
    // Clear the form fields after submission
    
  } catch (error) {
    console.error('Error fetching memories:', error);
  }
}
// Function to clear the form inputs
function clearForm() {
  document.getElementById('memory-form').reset(); // Reset the form
  document.getElementById('memory-form').removeAttribute('data-post-id'); // Remove postId if it was an update
  document.getElementById('current-image').src = ''; // Clear the displayed image (if any)
}

// Form submit event listener to create a new memory
document.getElementById('memory-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from refreshing the page

  const postId = document.getElementById('memory-form').getAttribute('data-post-id');
  const title = document.getElementById('blog-title').value;
  const message = document.getElementById('blog-content').value;
  const fileInput = document.getElementById('blog-image');
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('title', title);
  formData.append('message', message);
  if (file) {
    formData.append('selectedFile', file); // Append new file if uploaded
  }



  const token = localStorage.getItem('token'); // Get token from localStorage

  if (!token) {
    alert('You need to be logged in to create or update a memory.');
    return;
  }

  try {
    // Check if it's an update or create action
    const endpoint = postId ? `http://localhost:5000/posts/update/${postId}` : 'http://localhost:5000/posts/create';
    const method = postId ? 'PATCH' : 'POST';
    
    const response = await fetch(endpoint, {
      method: method,
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`, // Add the token to the headers
      },
    });
    if (!response.ok) {
      throw new Error(postId ? 'Failed to update memory' : 'Failed to create memory');
    }

    const newMemory = await response.json();
    console.log(newMemory);

    // If it's a new post, display it immediately
    if (!postId) {
      displayMemory(newMemory);
    } else {
      // Refresh the memories list
      fetchMemories();
    }
    clearForm();
  } catch (error) {
    console.error('Error submitting form:', error);
  }
});
function displayMemory(memory) {
  const memoriesSection = document.getElementById('memories-section');
  const memoryCard = document.createElement('article');
  memoryCard.classList.add('blog-post');

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  let currentUsername = null;

  if (isLoggedIn) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    currentUsername = payload.username;
    console.log('Current Username:', currentUsername);
  }

  memoryCard.innerHTML = `
    <div class="ellipsis-menu-container">
      ${currentUsername && memory.creator === currentUsername ? '<button class="ellipsis-btn">⋮</button>' : ''}
      <div class="menu-options" style="display:none;">
        <button class="update-btn" data-id="${memory._id}">Update</button>
        <button class="delete-btn" data-id="${memory._id}">Delete</button>
      </div>
    </div>
    <h2>${memory.title}</h2>
    <p class="blog-meta">by <strong>${memory.creator}</strong> on ${new Date(memory.createdAt).toLocaleDateString()}</p>
    <img src="http://localhost:5000${memory.selectedFile}" alt="Memory Image" class="blog-img">
    <p>${memory.message}</p>
    <div class="blog-interaction">
            <button class="like-btn" data-id="${memory._id}">${memory.likeCount} ❤️ Like</button>
            <button class="comment-btn">💬 Comments</button>
        </div>
        <div class="comments-section">
            <h3>Comments:</h3>
            <div class="existing-comments" style="display: none;">
                ${memory.comments.map(comment => `<p>${comment.content}</p>`)}
            </div>
        </div>
        <input type="text" class="comment-input" placeholder="Add a comment..." />
        <button class="submit-comment-btn" data-id="${memory._id}">Submit</button>
    `;

    const likeBtn = memoryCard.querySelector('.like-btn');
    likeBtn.addEventListener('click', async () => {
        const response = await fetch(`http://localhost:5000/posts/likePost/${memory._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const updatedMemory = await response.json();
            likeBtn.innerHTML = `${updatedMemory.likeCount} ❤️ Like`; // Update the like count
        } else {
            console.error('Error liking the post');
        }
    });
    //comment section
    const submitCommentBtn = memoryCard.querySelector('.submit-comment-btn');
    submitCommentBtn.addEventListener('click', async () => {
        const commentInput = memoryCard.querySelector('.comment-input');
        const response = await fetch(`http://localhost:5000/posts/commentPost/${memory._id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: commentInput.value }),
        });

        if (response.ok) {
            const updatedMemory = await response.json();
            commentInput.value = ''; // Clear the input
            // Optionally update comments in the UI
            memoryCard.querySelector('.existing-comments').innerHTML = updatedMemory.comments.map(comment => `<p>${comment.content} - <em>${comment.userId}</em></p>`).join('');
        } else {
            console.error('Error adding comment');
        }
    });

     // Add toggle functionality to the comment button
     const commentBtn = memoryCard.querySelector('.comment-btn');
     const commentsContainer = memoryCard.querySelector('.existing-comments');
 
     commentBtn.addEventListener('click', () => {
         // Toggle visibility of comments
         if (commentsContainer.style.display === 'none' || commentsContainer.style.display === '') {
             commentsContainer.style.display = 'block'; // Show comments
             commentBtn.textContent = 'Hide Comments'; // Change button text
         } else {
             commentsContainer.style.display = 'none'; // Hide comments
             commentBtn.textContent = '💬 Comments'; // Reset button text
         }
     });

  memoriesSection.appendChild(memoryCard);

  // Add ellipsis button functionality only if logged in and the user owns the post
  if (currentUsername && memory.creator === currentUsername) {
    const ellipsisBtn = memoryCard.querySelector('.ellipsis-btn');
    const menuOptions = memoryCard.querySelector('.menu-options');

    ellipsisBtn.addEventListener('click', () => {
      const isVisible = menuOptions.style.display === 'block';
      menuOptions.style.display = isVisible ? 'none' : 'block';
    });
  }


  // Add delete functionality
  const deleteBtn = memoryCard.querySelector('.delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      const postId = deleteBtn.getAttribute('data-id');

      if (!isLoggedIn) {
        alert('You are not authorized to delete this memory.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/posts/delete/${postId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('Memory deleted successfully!');
          memoryCard.remove(); // Remove the memory card from the DOM
        } else {
          const data = await response.json();
          alert(`Failed to delete memory: ${data.message}`);
        }
      } catch (error) {
        console.error('Error deleting memory:', error);
      }
    });
  }

  // Add update functionality
  const updateBtn = memoryCard.querySelector('.update-btn');
  if (updateBtn) {
    updateBtn.addEventListener('click', () => {
      // Fill form with the current memory's data
      document.getElementById('blog-title').value = memory.title;
      document.getElementById('blog-content').value = memory.message;
      document.getElementById('current-image').src = `http://localhost:5000${memory.selectedFile}`; // Show current image

      // Store the postId in the form for later use
      document.getElementById('memory-form').setAttribute('data-post-id', memory._id);
    });
  }
}


// Global variable to keep track of the current page
let currentPage = 1;
let totalPages = 1;

// Fetch memories by page number
async function fetchMemories(page = 1) {
  try {
    const response = await fetch(`http://localhost:5000/posts?page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch paginated memories');
    }

    const { data: memories, currentPage: fetchedPage, numberOfPages } = await response.json();
    
    // Update the current page and total pages
    currentPage = fetchedPage;
    totalPages = numberOfPages;

    // Clear the memories section before displaying new ones
    const memoriesSection = document.getElementById('memories-section');
    memoriesSection.innerHTML = '';

    // Display each memory
    memories.forEach(memory => {
      displayMemory(memory);
    });

    // Update pagination buttons visibility
    updatePaginationButtons();
  } catch (error) {
    console.error('Error fetching paginated memories:', error);
  }
}

// Function to update pagination buttons visibility
function updatePaginationButtons() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  // Disable previous button if on the first page
  prevBtn.disabled = currentPage === 1;

  // Disable next button if on the last page
  nextBtn.disabled = currentPage === totalPages;
}

// Function to handle the previous page
function prevPage() {
  if (currentPage > 1) {
    fetchMemories(currentPage - 1);
  }
}

// Function to handle the next page
function nextPage() {
  if (currentPage < totalPages) {
    fetchMemories(currentPage + 1);
  }
}

function updatePageNumberDisplay() {
  document.getElementById('current-page-display').textContent = currentPage;
  document.getElementById('total-pages-display').textContent = totalPages;
}

function updatePaginationButtons() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  updatePageNumberDisplay();  
}









