<template>
  <div>
    <!-- Breadcrumb -->
    <b-breadcrumb v-if="patient" class="mb-4">
      <b-breadcrumb-item :to="{ name: 'patients' }">Pacientes</b-breadcrumb-item>
      <b-breadcrumb-item active>{{ patient.name }}</b-breadcrumb-item>
    </b-breadcrumb>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <b-spinner variant="primary" />
    </div>

    <b-card v-else-if="patient">
      <h2 class="mb-4" style="font-size:1.25rem; font-weight:700;">Detalhes do paciente</h2>
      <hr class="mt-0 mb-4" />

      <b-row class="mb-3">
        <b-col cols="12" md="6">
          <p class="detail-label">Nome completo</p>
          <p class="detail-value">{{ patient.name }}</p>
        </b-col>
        <b-col cols="6" md="3">
          <p class="detail-label">CPF</p>
          <p class="detail-value">{{ patient.cpf }}</p>
        </b-col>
        <b-col cols="6" md="3">
          <p class="detail-label">RG</p>
          <p class="detail-value">{{ patient.rg }}</p>
        </b-col>
      </b-row>

      <b-row class="mb-3">
        <b-col cols="6" md="3">
          <p class="detail-label">Data de nascimento</p>
          <p class="detail-value">{{ patient.birth_date }}</p>
        </b-col>
        <b-col cols="6" md="3">
          <p class="detail-label">Sexo biológico</p>
          <p class="detail-value">{{ patient.biological_sex }}</p>
        </b-col>
        <b-col cols="6" md="3">
          <p class="detail-label">Celular</p>
          <p class="detail-value">{{ patient.phone }}</p>
        </b-col>
        <b-col cols="6" md="3">
          <p class="detail-label">E-mail</p>
          <p class="detail-value">{{ patient.email || '—' }}</p>
        </b-col>
      </b-row>

      <b-row v-if="patient.description" class="mb-3">
        <b-col cols="12">
          <p class="detail-label">Descrição</p>
          <p class="detail-value">{{ patient.description }}</p>
        </b-col>
      </b-row>

      <!-- Footer actions -->
      <div class="d-flex justify-content-between align-items-center mt-4">
        <b-button variant="outline-secondary" @click="$router.push({ name: 'patients' })">
          Voltar
        </b-button>
        <b-button variant="primary" @click="$router.push({ name: 'patient-edit', params: { id: patient.id } })">
          Editar paciente
        </b-button>
      </div>
    </b-card>

    <b-toaster name="b-toaster-top-right" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import patientService, { Patient } from '@/services/patientService'

export default Vue.extend({
  name: 'PatientDetailView',

  data() {
    return {
      patient: null as Patient | null,
      loading: false
    }
  },

  created() {
    this.fetchPatient()
  },

  methods: {
    async fetchPatient() {
      this.loading = true
      try {
        const { data } = await patientService.show(Number(this.$route.params.id))
        this.patient = data.data
      } catch (err: any) {
        this.$bvToast.toast(err.userMessage || 'Erro ao carregar paciente.', {
          title: 'Erro',
          variant: 'danger',
          autoHideDelay: 5000,
          toaster: 'b-toaster-top-right',
          solid: true
        })
        this.$router.push({ name: 'patients' })
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
