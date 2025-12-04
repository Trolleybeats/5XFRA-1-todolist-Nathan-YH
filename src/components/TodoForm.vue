<script setup>
import { ref } from "vue";

const nouvelleTache = ref("");

const emit = defineEmits(["demanderAjoutTache"]);

const gererSoumission = () => {
  const texteNettoye = nouvelleTache.value.trim();

  if (texteNettoye === "") {
    return;
  }

  emit("demanderAjoutTache", texteNettoye);

  nouvelleTache.value = "";
};
</script>

<template>
  <form @submit.prevent="gererSoumission">
    <input v-model="nouvelleTache" type="text" placeholder="Nouvelle tâche" />
    <button type="submit" :disabled="nouvelleTache === ''">Ajouter</button>
  </form>
</template>
<style scoped>
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
@media (max-width: 768px) {
  form {
    flex-direction: column;
  }
  form button {
    width: 100%;
    margin-top: 8px;
  }
}
</style>
