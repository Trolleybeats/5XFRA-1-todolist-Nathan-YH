<script setup>
const props = defineProps({
  tache: {
    type: Object,
    required: true,
  },
  peutUtiliserTriManuel: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits([
  "monter",
  "descendre",
  "basculerTerminee",
  "supprimerTache",
]);

function monter(id) {
  emit("monter", id);
}

function descendre(id) {
  emit("descendre", id);
}

function basculerTerminee(id) {
  emit("basculerTerminee", id);
}

function supprimerTache(id) {
  emit("supprimerTache", id);
}
</script>

<template>
  <li>
    <span :class="{ terminee: props.tache.terminee }">{{
      props.tache.libelle
    }}</span>

    <button
      type="button"
      @click="monter(props.tache.id)"
      :disabled="!props.peutUtiliserTriManuel"
    >
      ⬆
    </button>
    <button
      type="button"
      @click="descendre(props.tache.id)"
      :disabled="!props.peutUtiliserTriManuel"
    >
      ⬇
    </button>
    <button type="button" @click="basculerTerminee(props.tache.id)">✔</button>
    <button type="button" @click="supprimerTache(props.tache.id)">
      🗑 Supprimer
    </button>
  </li>
</template>

<style scoped>
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
  li {
    padding: 10px;
  }
}
</style>
