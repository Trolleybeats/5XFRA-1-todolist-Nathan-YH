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

const CLE_LOCALSTORAGE_TACHES = "todolist:taches";
const CLE_LOCALSTORAGE_PROCHAIN_ID = "todolist:prochainId";

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
  <div class="container">
    <h2>Todolist Nathan You-Hout</h2>

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

    <div class="ligne">
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
      </div>

      <div>
        <p class="total">
          Total : <span>{{ taches.length }}</span>
        </p>
        <p class="fini">
          Terminées : <span>{{ taches.filter((t) => t.terminee).length }}</span>
        </p>
      </div>
    </div>
    <p>
      Les flèches ⬆ et ⬇ ne fonctionnent que si le tri est "Ordre personnalisé".
    </p>

    <ul v-if="taches.length > 0">
      <li v-for="tache in taches" :key="tache.id">
        <span :class="{ terminee: tache.terminee }">{{ tache.libelle }}</span>

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
        <button type="button" @click="basculerTerminee(tache.id)">✔</button>
        <button type="button" @click="supprimerTache(tache.id)">
          🗑 Supprimer
        </button>
      </li>
    </ul>
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
form {
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
form input {
  flex-grow: 2;
  padding: 14px 16px;
  font-size: 16px;
  border: none;
  outline: none;
}
form input::placeholder {
  color: #aaa;
}
form button {
  flex-grow: 1;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 600;
  background: rgb(90, 90, 237);
  color: white;
  border: none;
  cursor: pointer;
}
form button:hover:enabled {
  background: rgb(69, 115, 251);
}
form button:disabled {
  opacity: 0.2;
  cursor: not-allowed;
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
ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  background: white;
  border: 2px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}
li:hover {
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}
li span {
  flex: 1;
  min-width: 0;
  font-size: 16px;
  color: #333;
  padding-left: 4px;
}
span.terminee {
  text-decoration: line-through;
  color: #999;
  opacity: 0.6;
}
button {
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px;
  border: none;
  background-color: #f5f5f5;
  transition: all 0.3s;
  font-weight: 500;
}
button:hover:enabled {
  background: #5a5aed;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
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

  li {
    padding: 10px;
  }
}
</style>
