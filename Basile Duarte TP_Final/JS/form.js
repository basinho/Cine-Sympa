document.addEventListener("DOMContentLoaded", function () {
    const apiBase = "https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1";
    const moviesUrl = `${apiBase}/movies`;
    const categoriesUrl = `${apiBase}/categories`;
  
    const filmForm = document.getElementById("film-form");
    const updateForm = document.getElementById("update-form");
  
    // Charger les catégories
    axios.get(categoriesUrl).then(response => {
        const categorySelects = document.querySelectorAll("#category, #updateCategory");
        response.data.forEach(category => {
            categorySelects.forEach(select => {
                select.innerHTML += `<option value="${category.id}">${category.name}</option>`;
            });
        });
    }).catch(error => console.error("Erreur lors du chargement des catégories :", error));
  
    // Charger les films pour sélection
    function loadMovies() {
        axios.get(moviesUrl).then(response => {
            const updateSelect = document.getElementById("updateMovie");
            const deleteSelect = document.getElementById("remove");
            updateSelect.innerHTML = "";
            deleteSelect.innerHTML = "";
            response.data.forEach(movie => {
                updateSelect.innerHTML += `<option value="${movie.id}">${movie.name}</option>`;
                deleteSelect.innerHTML += `<option value="${movie.id}">${movie.name}</option>`;
            });
        }).catch(error => console.error("Erreur lors du chargement des films :", error));
    }
  
    loadMovies();
  
    // Ajouter un nouveau film
    filmForm.addEventListener("submit", e => {
        e.preventDefault();
        const newFilm = {
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            author: document.getElementById("author").value,
            img: document.getElementById("poster").value,
            video: document.getElementById("trailer").value,
            category: document.getElementById("category").value
        };
  
        axios.post(moviesUrl, newFilm)
            .then(() => {
                alert("Film ajouté avec succès !");
                filmForm.reset();
                loadMovies();
            })
            .catch(error => console.error("Erreur lors de l'ajout :", error));
    });
  
    // Modifier un film
    document.getElementById("updateMovie").addEventListener("change", async () => {
        const movieId = document.getElementById("updateMovie").value;
    
        if (!movieId) { 
            alert("Veuillez sélectionner un film.");
            return;
        }
    
        try {
            // Récupérer les données du film sélectionné
            const response = await axios.get(`${moviesUrl}/${movieId}`);
            const movie = response.data;
    
            // Préremplir les champs du formulaire
            document.getElementById("newName").value = movie.name || '';
            document.getElementById("newDescription").value = movie.description || '';
            document.getElementById("newAuthor").value = movie.author || '';
            document.getElementById("newPoster").value = movie.img || '';
            document.getElementById("newTrailer").value = movie.video || '';
    
            // Pré-remplir la catégorie sélectionnée
            const categoryElement = document.getElementById("updateCategory");
            if (categoryElement) {
                categoryElement.value = movie.category || ''; 
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données du film :", error.response?.data || error.message);
            alert("Impossible de charger les données du film sélectionné.");
        }
    });
    
    
document.getElementById("updateMovieButton").addEventListener("click", async () => {
    const movieId = document.getElementById("updateMovie").value;

    if (!movieId) {
        alert("Veuillez sélectionner un film à mettre à jour.");
        return;
    }

    const updatedData = {};
    const nameElement = document.getElementById("newName");
    if (nameElement && nameElement.value.trim()) updatedData.name = nameElement.value.trim();

    const descriptionElement = document.getElementById("newDescription");
    if (descriptionElement && descriptionElement.value.trim()) updatedData.description = descriptionElement.value.trim();

    const authorElement = document.getElementById("newAuthor");
    if (authorElement && authorElement.value.trim()) updatedData.author = authorElement.value.trim();

    const imgElement = document.getElementById("newPoster");
    if (imgElement && imgElement.value.trim()) updatedData.img = imgElement.value.trim();

    const videoElement = document.getElementById("newTrailer");
    if (videoElement && videoElement.value.trim()) updatedData.video = videoElement.value.trim();

    const categoryElement = document.getElementById("updateCategory");
    if (categoryElement && categoryElement.value) updatedData.category = categoryElement.value; 
    if (Object.keys(updatedData).length === 0) {
        alert("Aucun champ n'a été modifié.");
        return;
    }

    try {
        const response = await axios.patch(`${moviesUrl}/${movieId}`, updatedData);

        if (response.status === 200) {
            alert("Film mis à jour avec succès !");
            updateForm.reset();
            loadMovies();
        } else {
            alert("Erreur inattendue lors de la mise à jour du film.");
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        if (error.response) {
            console.error("Réponse d'erreur du serveur :", error.response.data);
            alert("Erreur du serveur : " + JSON.stringify(error.response.data.errors));
        } else if (error.request) {
            console.error("La requête a été envoyée, mais aucune réponse n'a été reçue.");
        } else {
            console.error("Erreur lors de la configuration de la requête :", error.message);
        }
        alert("Une erreur est survenue lors de la mise à jour. Vérifiez les champs et réessayez.");
    }
});

  
    // Supprimer un film
    document.getElementById("removeButton").addEventListener("click", () => {
        const movieId = document.getElementById("remove").value;
        axios.delete(`${moviesUrl}/${movieId}`)
            .then(() => {
                alert("Film supprimé !");
                loadMovies();
            })
            .catch(error => console.error("Erreur lors de la suppression :", error));
    });
  });