document.addEventListener('DOMContentLoaded', function() {
    const availableTagsContainer = document.getElementById('availableTagsContainer');
    const tagInput = document.getElementById('tagInput');
    const addTagBtn = document.getElementById('addTagBtn');
    const tagContainer = document.getElementById('tagContainer');
    const movieContainer = document.getElementById('movieContainer');
    
    let selectedTags = [];
    let availableTags = [];
    let allMovies = [];

    // Fetch available tags from tags.json
    fetch('data/tags.json')
        .then(response => response.json())
        .then(data => {
            availableTags = data.tags;
            renderAvailableTags();
        })
        .catch(error => {
            console.error('Error fetching tags:', error);
            availableTagsContainer.innerHTML = 'Error loading tags';
        });

    // Fetch movies from movies.json
    fetch('data/movies.json')
        .then(response => response.json())
        .then(data => {
            allMovies = data.movies;
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            movieContainer.innerHTML = 'Error loading movies';
        });

    function renderAvailableTags() {
        availableTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'available-tag';
            tagElement.textContent = tag.name;
            
            tagElement.addEventListener('click', function() {
                const tagName = tag.name.toLowerCase();
                if (!selectedTags.includes(tagName)) {
                    selectedTags.push(tagName);
                    renderTags();
                    filterMovies();
                }
            });
            
            availableTagsContainer.appendChild(tagElement);
        });
    }

    addTagBtn.addEventListener('click', addTag);
    tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTag();
    });

    function addTag() {
        const tag = tagInput.value.trim().toLowerCase();
        const tagExists = availableTags.some(t => t.name.toLowerCase() === tag);
        
        if (tag && !selectedTags.includes(tag) && tagExists) {
            selectedTags.push(tag);
            renderTags();
            tagInput.value = '';
            filterMovies();
        } else if (!tagExists) {
            alert('This tag is not available. Please select from the available tags.');
        }
    }

    function renderTags() {
        tagContainer.innerHTML = '';
        selectedTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('tag', 'selected');
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
        selectedTags = selectedTags.filter(t => t !== tag);
        renderTags();
        filterMovies();
    }

    function filterMovies() {
        if (selectedTags.length > 0) {
            const filteredMovies = allMovies.filter(movie => {
                const movieTags = movie.tags.map(tag => tag.toLowerCase());
                return selectedTags.every(tag => movieTags.includes(tag));
            });
            renderMovies(filteredMovies);
        } else {
            movieContainer.innerHTML = '';
        }
    }

    function renderMovies(movies) {
        movieContainer.innerHTML = '';
        if (!Array.isArray(movies)) {
            console.error('Expected movies to be an array, got:', movies);
            return;
        }

        movies.forEach(movie => {
            console.log('Processing movie:', movie); // Debug log
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            
            // Ensure movie.tags is an array, if not, make it an empty array
            const tags = Array.isArray(movie.tags) ? movie.tags : [];
            const movieTags = tags.map(tag => `<span class="movie-tag">${tag}</span>`).join('');
    
            movieCard.innerHTML = `
                <img src="${movie.image}" >
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
});
