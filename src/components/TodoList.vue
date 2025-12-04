<script setup>
import TodoItem from "./TodoItem.vue";
const props = defineProps({
  tachesTriees: {
    type: Array,
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
</script>

<template>
  <ul>
    <TodoItem
      v-for="tache in props.tachesTriees"
      :key="tache.id"
      :tache="tache"
      :peutUtiliserTriManuel="props.peutUtiliserTriManuel"
      @monter="emit('monter', tache.id)"
      @descendre="emit('descendre', tache.id)"
      @basculerTerminee="emit('basculerTerminee', tache.id)"
      @supprimerTache="emit('supprimerTache', tache.id)"
    />
  </ul>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
