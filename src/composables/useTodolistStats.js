import { computed } from "vue";

export function useTodolistStats(taches) {
  //Statistiques
  const nombreTotalTaches = computed(() => taches.value.length);

  const nombreTachesTerminees = computed(
    () => taches.value.filter((t) => t.terminee).length
  );

  //Affichage conditionnel
  const aDesTaches = computed(() => {
    if (taches.value.length > 0) {
      return true;
    } else {
      return false;
    }
  });

  return {
    nombreTotalTaches,
    nombreTachesTerminees,
    aDesTaches,
  };
}
