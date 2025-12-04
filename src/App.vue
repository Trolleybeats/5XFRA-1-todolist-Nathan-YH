<script setup>
import { ref, computed, watch } from "vue";
import TodoList from "./components/TodoList.vue";
import TodoForm from "./components/TodoForm.vue";

// Constantes de configuration pour le localStorage
const CLE_LOCALSTORAGE_TACHES = "todolist:taches";
const CLE_LOCALSTORAGE_PROCHAIN_ID = "todolist:prochainId";

// Données réactives
const taches = ref([
  { id: 1, libelle: "texte de la tâche", terminee: false, ordre: 1 },
  { id: 2, libelle: "texte de la tâche 2", terminee: true, ordre: 2 },
  { id: 3, libelle: "texte de la tâche 3", terminee: false, ordre: 3 },
]);

const triCritere = ref("manuel");

// Initialisation depuis le localStorage
const tachesStockees = localStorage.getItem(CLE_LOCALSTORAGE_TACHES);
if (tachesStockees) {
  taches.value = JSON.parse(tachesStockees);
}

// Observateur pour sauvegarder automatiquement les tâches
watch(
  taches,
  (newTaches) => {
    localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(newTaches));
  },
  { deep: true }
);

const prochainIdStocke = localStorage.getItem(CLE_LOCALSTORAGE_PROCHAIN_ID);
const prochainId = ref(
  prochainIdStocke
    ? parseInt(prochainIdStocke, 10)
    : taches.value.length
    ? Math.max(...taches.value.map((t) => t.id)) + 1
    : 1
);

// Observateur pour sauvegarder automatiquement le prochainId
watch(prochainId, (newProchainId) => {
  localStorage.setItem(CLE_LOCALSTORAGE_PROCHAIN_ID, String(newProchainId));
});

//Ajout de tâche
function ajouterTache(texte) {
  taches.value.push({
    id: prochainId.value,
    libelle: texte,
    terminee: false,
    ordre: prochainId.value,
  });

  prochainId.value++;
}

//Gestion des tâches
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

//Tri des tâches
const tachesTriees = computed(() => {
  if (triCritere.value === "manuel") {
    return taches.value.toSorted((a, b) => a.ordre - b.ordre);
  } else if (triCritere.value === "creation") {
    return taches.value.toSorted((a, b) => a.id - b.id);
  } else if (triCritere.value === "libelleAsc") {
    return taches.value.toSorted((a, b) => a.libelle.localeCompare(b.libelle));
  } else if (triCritere.value === "libelleDesc") {
    return taches.value.toSorted((a, b) => b.libelle.localeCompare(a.libelle));
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
</script>

<template>
  <div class="container">
    <h2>Todolist Nathan You-Hout</h2>

    <TodoForm
      v-model:nouvelleTache="nouvelleTache"
      @demanderAjoutTache="ajouterTache"
    />

    <div class="ligne">
      <div>
        <label for="tri">Trier par :</label>
        <select id="tri" v-model="triCritere">
          <option value="manuel">Ordre personnalisé</option>
          <option value="creation">Ordre de création</option>
          <option value="libelleAsc">Libellé (A-Z)</option>
          <option value="libelleDesc">Libellé (Z-A)</option>
          <option value="terminee">Non terminées d'abord</option>
        </select>
      </div>

      <div>
        <p class="total">
          Total : <span>{{ nombreTotalTaches }}</span>
        </p>
        <p class="fini">
          Terminées : <span>{{ nombreTachesTerminees }}</span>
        </p>
      </div>
    </div>
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
label {
  font-weight: 500;
  color: #4b4b4b;
}
select {
  margin-left: 8px;
  margin-right: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  background: white;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.3s;
}
select:hover {
  border-color: rgb(90, 90, 237);
}
.ligne {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}
.ligne > div:first-child {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.ligne > div:last-child {
  display: flex;
  gap: 12px;
  margin-left: auto;
}
.ligne p {
  margin: 0;
  padding: 10px 18px;
  border-radius: 24px;
  font-weight: 500;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.ligne p.total {
  background: rgb(90, 90, 237);
  color: white;
}
.ligne p.fini {
  background: #96bf36;
  color: white;
}
.ligne p span {
  font-weight: 700;
  font-size: 17px;
  margin-left: 4px;
}
.ligne button {
  background: rgb(90, 90, 237);
  color: #f5f5f5;
  padding: 8px 16px;
  font-weight: 500;
}
.ligne button:hover:enabled {
  background: rgb(104, 104, 255);
}
p.empty {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 32px;
}

@media (max-width: 768px) {
  form {
    flex-direction: column;
  }
  form button {
    width: 100%;
    margin-top: 8px;
  }
  .ligne > div:last-child {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>
