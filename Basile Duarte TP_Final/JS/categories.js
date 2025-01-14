document.addEventListener("DOMContentLoaded", function () {
    const apiBase = "https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1";
    const categoriesUrl = `${apiBase}/categories`;
    const categoryForm = document.getElementById("category-form");
    const updateCategoryForm = document.getElementById("update-category-form");
    const deleteCategoryForm = document.getElementById("delete-category-form");
    const selectCategory = document.getElementById("selectCategory");
    const selectCategoryToDelete = document.getElementById("selectCategoryToDelete");

    if (!categoryForm || !updateCategoryForm || !deleteCategoryForm || !selectCategory || !selectCategoryToDelete) {
        console.error("Erreur : certains éléments HTML requis sont manquants.");
        return;
    }

    // Charger les catégories dans les menus déroulants
    function loadCategories() {
        axios.get(categoriesUrl)
            .then(response => {
                const categories = response.data;
                if (!categories.length) {
                    console.warn("Aucune catégorie trouvée.");
                }

                // Réinitialiser les listes déroulantes
                selectCategory.innerHTML = "";
                selectCategoryToDelete.innerHTML = "";

                // Ajouter chaque catégorie aux listes
                categories.forEach(category => {
                    const option = `<option value="${category.id}">${category.name}</option>`;
                    selectCategory.innerHTML += option;
                    selectCategoryToDelete.innerHTML += option;
                });
            })
            .catch(error => {
                console.error("Erreur lors du chargement des catégories :", error);
                alert("Impossible de charger les catégories. Vérifiez votre connexion ou contactez l'administrateur.");
            });
    }

    // Ajouter une nouvelle catégorie
    categoryForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const newCategoryName = document.getElementById("newCategory").value.trim();
        if (!newCategoryName) {
            alert("Le nom de la catégorie est obligatoire !");
            return;
        }

        axios.post(categoriesUrl, { name: newCategoryName })
            .then(() => {
                alert("Catégorie ajoutée avec succès !");
                categoryForm.reset();
                loadCategories();
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout de la catégorie :", error);
                alert("Impossible d'ajouter la catégorie. Veuillez réessayer.");
            });
    });

    // Modifier une catégorie existante
    updateCategoryForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const categoryId = selectCategory.value;
        const updatedName = document.getElementById("updatedCategoryName").value.trim();
        if (!categoryId) {
            alert("Veuillez sélectionner une catégorie à modifier !");
            return;
        }
        if (!updatedName) {
            alert("Le nouveau nom de la catégorie est obligatoire !");
            return;
        }

        axios.put(`${categoriesUrl}/${categoryId}`, { name: updatedName })
            .then(() => {
                alert("Catégorie modifiée avec succès !");
                updateCategoryForm.reset();
                loadCategories();
                console.log("ID de la catégorie sélectionnée :", categoryId);

            })
            .catch(error => {
                console.error("Erreur lors de la modification de la catégorie :", error);
                alert("Impossible de modifier la catégorie. Veuillez réessayer.");
            });
    });

    // Supprimer une catégorie
    deleteCategoryForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const categoryId = selectCategoryToDelete.value;
        if (!categoryId) {
            alert("Veuillez sélectionner une catégorie à supprimer !");
            return;
        }

        axios.delete(`${categoriesUrl}/${categoryId}`)
            .then(() => {
                alert("Catégorie supprimée avec succès !");
                loadCategories();
            })
            .catch(error => {
                console.error("Erreur lors de la suppression de la catégorie :", error);
                alert("Une erreur est survenue lors de la suppression de la catégorie.");
            });
    });

    // Charger les catégories au démarrage
    loadCategories();
});
