document.addEventListener("DOMContentLoaded", function () {
    const apiBase = "https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1";
    const moviesUrl = `${apiBase}/movies`;
    const categoriesUrl = `${apiBase}/categories`;

    const searchBar = document.getElementById("searchBar");
    const moviesContainer = document.getElementById("movies");
    const sortSelect = document.getElementById("sort");
    const localVotes = JSON.parse(localStorage.getItem("votes")) || {};

    // Charger les catégories
    axios.get(categoriesUrl).then(response => {
        const categoriesDiv = document.getElementById("categories");
        categoriesDiv.innerHTML = ``; 
    
        // Bouton "Toutes les catégories"
        const allCategoriesButton = document.createElement("span");
        allCategoriesButton.className = "category-tag";
        allCategoriesButton.textContent = "Toutes les catégories";
        allCategoriesButton.addEventListener("click", () => loadMovies());
        categoriesDiv.appendChild(allCategoriesButton);
    
        // Ajouter les catégories individuelles
        response.data.forEach(category => {
            const tag = document.createElement("span");
            tag.className = "category-tag";
            tag.textContent = category.name;
            tag.addEventListener("click", () => loadMovies("", category.id));
            categoriesDiv.appendChild(tag);
        });
    }).catch(error => console.error("Erreur lors du chargement des catégories :", error));
    
    // Charger les films
    function loadMovies(query = "", categoryId = null) {
        axios.get(moviesUrl).then(response => {
            let movies = response.data;

            if (query) {
                movies = movies.filter(movie =>
                    movie.name.toLowerCase().includes(query.toLowerCase())
                );
            }

            if (categoryId) {
                movies = movies.filter(movie => movie.category === categoryId);
            }

            if (sortSelect.value === "likes") {
                movies.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            }

            renderMovies(movies);
        }).catch(error => console.error("Erreur lors du chargement des films :", error));
    }

    function renderMovies(movies) {
        moviesContainer.innerHTML = "";
        if (movies.length === 0) {
            moviesContainer.innerHTML = "<p>Aucun film trouvé.</p>";
            return;
        }
    
        // Générer les cartes des films
        movies.forEach(movie => {
            const hasVoted = localVotes[movie.id] || null;
    
            const movieCard = document.createElement("div");
            movieCard.className = "movie-card";
            movieCard.setAttribute("data-id", movie.id);
    
            movieCard.innerHTML = `
                <img class="movie-poster" src="${movie.img}" alt="${movie.name}" />
                <h3>${movie.name}</h3>
                <p>${movie.description}</p>
                <p><strong>Ratio : ${movie.likes || 0} 👍 / ${movie.dislikes || 0} 👎</strong></p>
                <div class="actions">
                    <button class="like" data-id="${movie.id}" ${hasVoted === "like" ? "disabled" : ""}>Like</button>
                    <button class="dislike" data-id="${movie.id}" ${hasVoted === "dislike" ? "disabled" : ""}>Dislike</button>
                </div>
            `;
    
            // Ajout du gestionnaire d'événement pour la carte
            movieCard.addEventListener("click", function (event) {
                const movieId = this.getAttribute("data-id");
                if (event.target.classList.contains("like") || event.target.classList.contains("dislike")) {
                    return;
                }
                window.location.href = `presentation.html?id=${movieId}`;
            });
    
            moviesContainer.appendChild(movieCard);
        });
    
        // Gestion des likes/dislikes
        document.querySelectorAll(".like").forEach(button => {
            button.addEventListener("click", function (event) {
                event.stopPropagation(); 
                const movieId = this.getAttribute("data-id");
                voteMovie(movieId, "like");
            });
        });
    
        document.querySelectorAll(".dislike").forEach(button => {
            button.addEventListener("click", function (event) {
                event.stopPropagation(); 
                const movieId = this.getAttribute("data-id");
                voteMovie(movieId, "dislike");
            });
        });
    }
    

    // Voter pour un film
    function voteMovie(movieId, type) {
        if (localVotes[movieId]) return;

        axios.patch(`${moviesUrl}/${movieId}/${type}`)
            .then(() => {
                localVotes[movieId] = type;
                localStorage.setItem("votes", JSON.stringify(localVotes));
                loadMovies(searchBar.value);
            })
            .catch(error => console.error("Erreur lors du vote :", error));
    }

    // Recherche
    searchBar.addEventListener("input", () => loadMovies(searchBar.value));

    // Trier
    sortSelect.addEventListener("change", () => loadMovies(searchBar.value));

    // Initialiser
    loadMovies();
});
