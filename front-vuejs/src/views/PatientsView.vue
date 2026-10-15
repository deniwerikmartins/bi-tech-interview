<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Pacientes</h1>
      <b-button variant="primary" @click="$router.push('/pacientes/novo')">
        Novo paciente
      </b-button>
    </div>

    <!-- Search -->
    <div class="search-wrapper">
      <b-icon icon="search" class="search-icon" />
      <b-form-input
        v-model="search"
        placeholder="Buscar por nome do paciente ou CPF"
        class="w-100"
        @input="onSearchInput"
      />
    </div>

    <!-- Table card -->
    <b-card class="patients-table p-0">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-5">
        <b-spinner variant="primary" />
      </div>

      <!-- Empty state -->
      <div v-else-if="patients.length === 0" class="text-center py-5 text-muted">
        Nenhum paciente encontrado.
      </div>

      <!-- Table -->
      <b-table
        v-else
        :items="patients"
        :fields="fields"
        hover
        responsive
        class="mb-0"
        thead-class="patients-table"
      >
        <!-- Actions column -->
        <template #cell(actions)="{ item }">
          <button class="btn-view" :title="'Ver ' + item.name" @click="$router.push(`/pacientes/${item.id}`)">
            <b-icon icon="eye" />
          </button>
        </template>
      </b-table>
    </b-card>

    <!-- Pagination -->
    <div v-if="lastPage > 1" class="d-flex justify-content-end mt-3">
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        @change="fetchPatients"
      />
    </div>

    <!-- Toast container -->
    <b-toaster name="b-toaster-top-right" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import patientService, { Patient } from '@/services/patientService'

export default Vue.extend({
  name: 'PatientsView',

  data() {
    return {
      patients: [] as Patient[],
      loading: false,
      search: '',
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      lastPage: 1,
      searchTimeout: null as ReturnType<typeof setTimeout> | null,
      fields: [
        { key: 'name',       label: 'Nome do paciente', sortable: false },
        { key: 'cpf',        label: 'CPF',              sortable: false },
        { key: 'phone',      label: 'Celular',          sortable: false },
        { key: 'birth_date', label: 'Data de nascimento', sortable: false },
        { key: 'actions',    label: '',                 sortable: false, thStyle: 'width:60px' }
      ]
    }
  },

  created() {
    // Show success toast if redirected after create/edit/delete
    const msg = this.$route.query.toast as string | undefined
    if (msg) {
      this.$bvToast.toast(msg, {
        title: 'Sucesso',
        variant: 'success',
        autoHideDelay: 4000,
        toaster: 'b-toaster-top-right',
        solid: true
      })
      this.$router.replace({ query: {} })
    }

    this.fetchPatients(1)
  },

  methods: {
    onSearchInput() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1
        this.fetchPatients(1)
      }, 400)
    },

    async fetchPatients(page: number) {
      this.loading = true
      try {
        const { data } = await patientService.list({
          search: this.search || undefined,
          page,
          per_page: this.perPage
        })
        this.patients    = data.data
        this.totalRows   = data.meta.total
        this.lastPage    = data.meta.last_page
        this.currentPage = data.meta.current_page
      } catch (err: any) {
        this.$bvToast.toast(err.userMessage || 'Erro ao carregar pacientes.', {
          title: 'Erro',
          variant: 'danger',
          autoHideDelay: 5000,
          toaster: 'b-toaster-top-right',
          solid: true
        })
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
