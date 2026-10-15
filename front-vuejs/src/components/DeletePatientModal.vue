<template>
  <b-modal
    id="delete-patient-modal"
    title="Excluir paciente"
    hide-footer
    centered
    @hide="$emit('cancel')"
  >
    <p class="mb-4">
      Atenção! Ao excluir este paciente,
      <strong>essa ação não poderá ser desfeita</strong>.
      Deseja realmente continuar?
    </p>

    <div class="d-flex justify-content-between align-items-center">
      <button class="btn-link-danger" @click="$emit('cancel')">
        Cancelar
      </button>
      <b-button variant="primary" :disabled="loading" @click="$emit('confirm')">
        <b-spinner v-if="loading" small class="mr-2" />
        Confirmar
      </b-button>
    </div>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DeletePatientModal',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
})
</script>
