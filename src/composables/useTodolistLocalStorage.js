import { watch, onMounted } from "vue";

export function useTodolistLocalStorage(taches, prochainId, options = {}) {
  // Déstructurer les options pour récupérer les clés de stockage
  const { cleTaches, cleProchainId } = options;

  // TODO :
  // - fonction d'initialisation depuis localStorage
  // - watchers pour enregistrer les changements

  function initialiserDepuisLocalStorage() {
    // Initialisation depuis le localStorage
    const tachesStockees = localStorage.getItem(cleTaches);
    if (tachesStockees) {
      taches.value = JSON.parse(tachesStockees);
    }

    const prochainIdStocke = localStorage.getItem(cleProchainId);
    if (prochainIdStocke) {
      prochainId.value = parseInt(prochainIdStocke, 10);
    } else if (taches.value.length) {
      prochainId.value = Math.max(...taches.value.map((t) => t.id)) + 1;
    }
  }

  onMounted(() => {
    initialiserDepuisLocalStorage();
  });

  // Observateur pour sauvegarder automatiquement les tâches
  watch(
    taches,
    (newTaches) => {
      localStorage.setItem(cleTaches, JSON.stringify(newTaches));
    },
    { deep: true }
  );

  // Observateur pour sauvegarder automatiquement le prochainId
  watch(prochainId, (newProchainId) => {
    localStorage.setItem(cleProchainId, String(newProchainId));
  });
}
