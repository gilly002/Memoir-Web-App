document.querySelector('.search-button').addEventListener('click', async () => {
    const searchQuery = document.querySelector('.search-input').value.trim();

    if (!searchQuery) {
        alert('Please enter a search term');
        return;
    }

    try {
        // First, try to search by creator
        const response = await fetch(`http://localhost:5000/posts/creator?creator=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();

        if (response.ok && data.data.length > 0) {
            // Clear previous results (if any)
            document.getElementById('memories-section').innerHTML = '';

            // Display search results for creator
            data.data.forEach(memory => {
                displayMemory(memory); // Assuming displayMemory is your function to render posts
            });
        } else {
            // If no results by creator, try searching by title and tags
            const titleResponse = await fetch(`http://localhost:5000/posts/search?searchQuery=${encodeURIComponent(searchQuery)}`);
            const titleData = await titleResponse.json();

            if (titleResponse.ok) {
                // Clear previous results (if any)
                document.getElementById('memories-section').innerHTML = '';

                // Display search results for title
                titleData.data.forEach(memory => {
                    displayMemory(memory); // Assuming displayMemory is your function to render posts
                });
            } else {
                console.error('Error fetching posts by title:', titleData.message);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});