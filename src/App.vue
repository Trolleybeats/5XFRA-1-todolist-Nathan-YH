<script setup>
import { ref } from "vue";
import TodoList from "./components/TodoList.vue";
import TodoForm from "./components/TodoForm.vue";
import TodoTri from "./components/TodoTri.vue";
import { useTodolistLocalStorage } from "./composables/useTodolistLocalStorage.js";
import { useTodolistStats } from "./composables/useTodolistStats.js";
import { useTodolistTri } from "./composables/useTodolistTri.js";

const CLE_LOCALSTORAGE_TACHES = "todolist:taches";
const CLE_LOCALSTORAGE_PROCHAIN_ID = "todolist:prochainId";

// Données réactives
const taches = ref([]);

const prochainId = ref(1);
const triCritere = ref("manuel");

useTodolistLocalStorage(taches, prochainId, {
  cleTaches: CLE_LOCALSTORAGE_TACHES,
  cleProchainId: CLE_LOCALSTORAGE_PROCHAIN_ID,
});

const { nombreTotalTaches, nombreTachesTerminees, aDesTaches } =
  useTodolistStats(taches);

const { tachesTriees, peutUtiliserTriManuel } = useTodolistTri(
  taches,
  triCritere
);

//Gestion des tâches
function ajouterTache(texte) {
  taches.value.push({
    id: prochainId.value,
    libelle: texte,
    terminee: false,
    ordre: prochainId.value,
  });

  prochainId.value++;
}

function basculerTerminee(id) {
  const tache = taches.value.find((t) => t.id === id);
  if (tache) {
    tache.terminee = !tache.terminee;
  }
}

function supprimerTache(id) {
  taches.value = taches.value.filter((t) => t.id !== id);
}

//Gestion du tri manuel
function monter(id) {
  if (triCritere.value !== "manuel") return;

  const indexVisuel = tachesTriees.value.findIndex((t) => t.id === id);
  if (indexVisuel > 0) {
    const tacheAmonter = tachesTriees.value[indexVisuel];
    const tacheAuDessus = tachesTriees.value[indexVisuel - 1];

    const tacheSourceAmonter = taches.value.find(
      (t) => t.id === tacheAmonter.id
    );
    const tacheSourceAuDessus = taches.value.find(
      (t) => t.id === tacheAuDessus.id
    );

    const tempOrdre = tacheSourceAmonter.ordre;
    tacheSourceAmonter.ordre = tacheSourceAuDessus.ordre;
    tacheSourceAuDessus.ordre = tempOrdre;
  }
}

function descendre(id) {
  if (triCritere.value !== "manuel") return;

  const indexVisuel = tachesTriees.value.findIndex((t) => t.id === id);
  if (indexVisuel < tachesTriees.value.length - 1) {
    const tacheAdescendre = tachesTriees.value[indexVisuel];
    const tacheEnDessous = tachesTriees.value[indexVisuel + 1];

    const tacheSourceAdescendre = taches.value.find(
      (t) => t.id === tacheAdescendre.id
    );
    const tacheSourceEnDessous = taches.value.find(
      (t) => t.id === tacheEnDessous.id
    );

    const tempOrdre = tacheSourceAdescendre.ordre;
    tacheSourceAdescendre.ordre = tacheSourceEnDessous.ordre;
    tacheSourceEnDessous.ordre = tempOrdre;
  }
}
</script>

<template>
  <div class="container">
    <h2>Todolist Nathan You-Hout</h2>

    <TodoForm @demanderAjoutTache="ajouterTache" />

    <TodoTri
      :triCritere="triCritere"
      :nombreTotalTaches="nombreTotalTaches"
      :nombreTachesTerminees="nombreTachesTerminees"
      @changerTri="triCritere = $event"
    />
    <p>
      Les flèches ⬆ et ⬇ ne fonctionnent que si le tri est "Ordre personnalisé".
    </p>

    <TodoList
      v-if="aDesTaches"
      :tachesTriees="tachesTriees"
      :peutUtiliserTriManuel="peutUtiliserTriManuel"
      @monter="monter"
      @descendre="descendre"
      @basculerTerminee="basculerTerminee"
      @supprimerTache="supprimerTache"
    />
    <p v-else class="empty">Aucune tâche disponible.</p>
  </div>
</template>

<style>
body {
  background: rgb(90, 90, 237);
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
}
</style>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
h2 {
  margin: 0 0 24px 0;
  color: #333;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
}
p.empty {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 32px;
}
</style>
