import { computed } from "vue";

export function useTodolistTri(taches, triCritere) {
  //Tri des tâches
  const tachesTriees = computed(() => {
    if (triCritere.value === "manuel") {
      return taches.value.toSorted((a, b) => a.ordre - b.ordre);
    } else if (triCritere.value === "creation") {
      return taches.value.toSorted((a, b) => a.id - b.id);
    } else if (triCritere.value === "libelleAsc") {
      return taches.value.toSorted((a, b) =>
        a.libelle.localeCompare(b.libelle)
      );
    } else if (triCritere.value === "libelleDesc") {
      return taches.value.toSorted((a, b) =>
        b.libelle.localeCompare(a.libelle)
      );
    } else if (triCritere.value === "terminee") {
      return taches.value.toSorted((a, b) => {
        if (a.terminee === b.terminee) {
          return a.libelle.localeCompare(b.libelle);
        }
        return a.terminee - b.terminee;
      });
    }
    return taches.value;
  });

  //Gestion du tri manuel
  const peutUtiliserTriManuel = computed(() => {
    if (triCritere.value === "manuel") {
      return true;
    } else {
      return false;
    }
  });
  return {
    tachesTriees,
    peutUtiliserTriManuel,
  };
}
