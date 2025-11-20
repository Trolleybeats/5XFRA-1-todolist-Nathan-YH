<script setup>
import { ref } from "vue";
import { reactive } from "vue";

const taches = ref([
  { id: 1, libelle: "texte de la tâche", terminee: false, ordre: 1 },
  { id: 2, libelle: "texte de la tâche 2", terminee: true, ordre: 2 },
  { id: 3, libelle: "texte de la tâche 3", terminee: false, ordre: 3 },
]);

const nouvelleTache = ref("");

const triCritere = ref("manuel");

const CLE_LOCALSTORAGE_TACHES = "todolist.taches";
const CLE_LOCALSTORAGE_PROCHAIN_ID = "todolist.prochainId";

const tachesStockees = localStorage.getItem(CLE_LOCALSTORAGE_TACHES);
if (tachesStockees) {
  taches.value = JSON.parse(tachesStockees);
}

const prochainIdStocke = localStorage.getItem(CLE_LOCALSTORAGE_PROCHAIN_ID);
const prochainId = ref(
  prochainIdStocke
    ? parseInt(prochainIdStocke, 10)
    : taches.value.length
    ? Math.max(...taches.value.map((t) => t.id)) + 1
    : 1
);

function ajouterTache() {
  taches.value.push({
    id: prochainId.value,
    libelle: nouvelleTache.value,
    terminee: false,
    ordre: prochainId.value,
  });

  prochainId.value++;
  nouvelleTache.value = "";
  appliquerTri();

  localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(taches.value));
  localStorage.setItem(
    CLE_LOCALSTORAGE_PROCHAIN_ID,
    prochainId.value.toString()
  );
}

function basculerTerminee(id) {
  const tache = taches.value.find((t) => t.id === id);
  if (tache) {
    tache.terminee = !tache.terminee;
  }

  localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(taches.value));
}
function supprimerTache(id) {
  taches.value = taches.value.filter((t) => t.id !== id);

  localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(taches.value));
}

function monter(id) {
  if (triCritere.value !== "manuel") return;

  const index = taches.value.findIndex((t) => t.id === id);
  if (index > 0) {
    const tacheAmonter = taches.value[index];
    const tacheAuDessus = taches.value[index - 1];
    const tempOrdre = tacheAmonter.ordre;
    tacheAmonter.ordre = tacheAuDessus.ordre;
    tacheAuDessus.ordre = tempOrdre;
    appliquerTri();

    localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(taches.value));
  }
}

function descendre(id) {
  if (triCritere.value !== "manuel") return;
  const index = taches.value.findIndex((t) => t.id === id);
  if (index < taches.value.length - 1) {
    const tacheAdescendre = taches.value[index];
    const tacheEnDessous = taches.value[index + 1];
    const tempOrdre = tacheAdescendre.ordre;
    tacheAdescendre.ordre = tacheEnDessous.ordre;
    tacheEnDessous.ordre = tempOrdre;
    appliquerTri();

    localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(taches.value));
  }
}

function appliquerTri() {
  if (triCritere.value === "manuel") {
    taches.value.sort((a, b) => a.ordre - b.ordre);
  } else if (triCritere.value === "creation") {
    taches.value.sort((a, b) => a.id - b.id);
  } else if (triCritere.value === "libelleAsc") {
    taches.value.sort((a, b) => a.libelle.localeCompare(b.libelle));
  } else if (triCritere.value === "libelleDesc") {
    taches.value.sort((a, b) => b.libelle.localeCompare(a.libelle));
  } else if (triCritere.value === "terminee") {
    taches.value.sort((a, b) => {
      if (a.terminee === b.terminee) {
        return a.libelle.localeCompare(b.libelle);
      }
      return a.terminee - b.terminee;
    });
  }
}
</script>

<template>
  <h2>Exo Synthèse</h2>

  <form>
    <input v-model="nouvelleTache" type="text" placeholder="Nouvelle tâche" />
    <button
      type="button"
      @click="ajouterTache"
      :disabled="nouvelleTache === ''"
    >
      Ajouter
    </button>
  </form>

  <div>
    <label for="tri">Trier par :</label>
    <select id="tri" v-model="triCritere" @change="appliquerTri">
      <option value="manuel">Ordre personnalisé</option>
      <option value="creation">Ordre de création</option>
      <option value="libelleAsc">Libellé (A-Z)</option>
      <option value="libelleDesc">Libellé (Z-A)</option>
      <option value="terminee">Non terminées d'abord</option>
    </select>
    <button type="button" @click="appliquerTri">Appliquer le tri</button>
    <p>
      Les flèches ⬆ et ⬇ ne fonctionnent que si le tri est "Ordre personnalisé".
    </p>
  </div>

  <p>Total : {{ taches.length }}</p>
  <p>Terminées : {{ taches.filter((t) => t.terminee).length }}</p>

  <ul v-if="taches.length > 0">
    <li v-for="tache in taches" :key="tache.id">
      <span :class="{ terminee: tache.terminee }">{{ tache.libelle }}</span>

      <button type="button" @click="basculerTerminee(tache.id)">✔</button>
      <button type="button" @click="supprimerTache(tache.id)">
        🗑 Supprimer
      </button>
      <button
        type="button"
        @click="monter(tache.id)"
        :disabled="triCritere !== 'manuel'"
      >
        ⬆
      </button>
      <button
        type="button"
        @click="descendre(tache.id)"
        :disabled="triCritere !== 'manuel'"
      >
        ⬇
      </button>
    </li>
  </ul>
  <p v-else>Aucune tâche disponible.</p>
</template>

<style scoped>
form {
  display: grid;
  grid-template-areas:
    "input"
    "button";
  gap: 8px;
  margin-bottom: 16px;
}
form input {
  grid-area: input;
  padding: 8px;
  font-size: 16px;
}
form button {
  grid-area: button;
  padding: 8px;
  font-size: 10px;
}
div {
  margin-bottom: 16px;
}
select {
  margin-left: 8px;
  margin-right: 8px;
  padding: 4px;
  border-radius: 4px;
}
ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
}
li {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
span.terminee {
  text-decoration: line-through;
  color: gray;
}
button {
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  border: none;
  background-color: #f0f0f0;
  transition: background-color 0.3s;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
button:hover:enabled {
  background-color: orangered;
}
</style>
