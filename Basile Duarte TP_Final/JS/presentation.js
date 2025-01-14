document.addEventListener("DOMContentLoaded", function () {
    const apiBase = "https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1";
    const moviesUrl = `${apiBase}/movies`;

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");

    if (!movieId) {
        alert("Aucun film sélectionné !");
        window.location.href = "index.html";
        return;
    }

    function loadMovieDetails() {
        axios.get(`${moviesUrl}/${movieId}`)
            .then(response => {
                const movie = response.data;
                const filmDetails = document.getElementById("filmDetails");

                // Créer l'intégration de l'iframe pour YouTube
                const videoHTML = movie.video
                    ? `<iframe 
                           width="560" 
                           height="315" 
                           src="${movie.video}" 
                           frameborder="0" 
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                           allowfullscreen>
                       </iframe>`
                    : `<p style="color: #f44336;">Aucune bande-annonce disponible.</p>`;

                // Insérer les détails du film et la vidéo
                filmDetails.innerHTML = `
                    <img src="${movie.img}" alt="${movie.name}" class="movie-detail-poster">
                    <h2>${movie.name}</h2>
                    <p>${movie.description}</p>
                    <p><strong>Auteur :</strong> ${movie.author}</p>
                    ${videoHTML}
                `;

                console.log("Vidéo chargée :", movie.video);
            })
            .catch(error => {
                console.error("Erreur lors du chargement des détails du film :", error);
                alert("Impossible de charger les détails du film.");
                window.location.href = "index.html";
            });
    }

    loadMovieDetails();
});
