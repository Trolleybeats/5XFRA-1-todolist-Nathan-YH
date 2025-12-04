<script setup>
const props = defineProps({
  triCritere: {
    type: String,
    required: true,
  },
  nombreTotalTaches: {
    type: Number,
    required: true,
  },
  nombreTachesTerminees: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["changerTri"]);

function onChange(event) {
  emit("changerTri", event.target.value);
}
</script>

<template>
  <div class="ligne">
    <div>
      <label for="tri">Trier par :</label>
      <select id="tri" :value="props.triCritere" @change="onChange">
        <option value="manuel">Ordre personnalisé</option>
        <option value="creation">Ordre de création</option>
        <option value="libelleAsc">Libellé (A-Z)</option>
        <option value="libelleDesc">Libellé (Z-A)</option>
        <option value="terminee">Non terminées d'abord</option>
      </select>
    </div>

    <div>
      <p class="total">
        Total : <span>{{ props.nombreTotalTaches }}</span>
      </p>
      <p class="fini">
        Terminées : <span>{{ props.nombreTachesTerminees }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
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
@media (max-width: 768px) {
  .ligne > div:last-child {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>
