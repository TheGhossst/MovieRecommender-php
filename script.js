document.addEventListener('DOMContentLoaded', () => {
    const tagInput = document.getElementById('tagInput');
    const addTagBtn = document.getElementById('addTagBtn');
    const tagContainer = document.getElementById('tagContainer');
    const movieContainer = document.getElementById('movieContainer');

    let tags = [];

    addTagBtn.addEventListener('click', addTag);
    tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTag();
    });

    function addTag() {
        const tag = tagInput.value.trim().toLowerCase();
        if (tag && !tags.includes(tag)) {
            tags.push(tag);
            renderTags();
            tagInput.value = '';
            fetchMovies();
        }
    }

    function renderTags() {
        tagContainer.innerHTML = '';
        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('tag');
            tagElement.textContent = tag;
            const removeBtn = document.createElement('span');
            removeBtn.classList.add('remove');
            removeBtn.textContent = '×';
            removeBtn.onclick = () => removeTag(tag);
            tagElement.appendChild(removeBtn);
            tagContainer.appendChild(tagElement);
        });
    }

    function removeTag(tag) {
        tags = tags.filter(t => t !== tag);
        renderTags();
        fetchMovies();
    }

    function fetchMovies() {
        // Only fetch movies if there are tags present
        if (tags.length > 0) {
            fetch('get_movies.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `tags=${encodeURIComponent(JSON.stringify(tags))}`
            })
            .then(response => response.json())
            .then(movies => renderMovies(movies))
            .catch(error => console.error('Error:', error));
        } else {
            // If no tags, clear the movie container
            movieContainer.innerHTML = '';
        }
    }
    function renderMovies(movies) {
        movieContainer.innerHTML = '';
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            
            // Split the tags string by comma and create the tag elements
            const movieTags = movie.tags.split(',').map(tag => `<span class="movie-tag">${tag.trim()}</span>`).join('');
    
            movieCard.innerHTML = `
            <img src="${movie.image}"  onerror="this.onerror=null; this.src='https://via.placeholder.com/250x200.png?text=${movie.title}';">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-year">${movie.year}</p>
                <p class="movie-rating">★ ${movie.rating.toFixed(1)}</p>
                <div class="movie-tags">
                    ${movieTags}
                </div>
            </div>
        `;
        
            movieContainer.appendChild(movieCard);
        });
    }
    //fetchMovies();
});