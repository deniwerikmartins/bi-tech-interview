<template>
  <div>
    <!-- Breadcrumb -->
    <b-breadcrumb class="mb-4">
      <b-breadcrumb-item :to="{ name: 'patients' }">Pacientes</b-breadcrumb-item>
      <b-breadcrumb-item v-if="patient" :to="{ name: 'patient-detail', params: { id: patient.id } }">
        {{ patient.name }}
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Editar paciente</b-breadcrumb-item>
    </b-breadcrumb>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <b-spinner variant="primary" />
    </div>

    <b-card v-else-if="form">
      <h2 class="mb-4" style="font-size:1.25rem; font-weight:700;">Editar paciente</h2>
      <hr class="mt-0 mb-4" />

      <b-form @submit.prevent="submit">
        <!-- Row 1: Nome / CPF / RG -->
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group>
              <label class="form-label">Nome completo</label>
              <b-form-input
                v-model="form.name"
                :state="fieldState('name')"
              />
              <b-form-invalid-feedback>{{ firstError('name') }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="6" md="3">
            <b-form-group>
              <label class="form-label">CPF</label>
              <b-form-input
                v-model="form.cpf"
                v-mask="'###.###.###-##'"
                :state="fieldState('cpf')"
              />
              <b-form-invalid-feedback>{{ firstError('cpf') }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="6" md="3">
            <b-form-group>
              <label class="form-label">RG</label>
              <b-form-input
                v-model="form.rg"
                v-mask="'##.###.###-X'"
                :state="fieldState('rg')"
              />
              <b-form-invalid-feedback>{{ firstError('rg') }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Row 2: Nascimento / Sexo / Celular / Email -->
        <b-row>
          <b-col cols="6" md="3">
            <b-form-group>
              <label class="form-label">Data de nascimento</label>
              <b-form-input
                v-model="form.birth_date"
                type="date"
                :state="fieldState('birth_date')"
              />
              <b-form-invalid-feedback>{{ firstError('birth_date') }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="6" md="3">
            <b-form-group>
              <label class="form-label">Sexo biológico</label>
              <b-form-select
                v-model="form.biological_sex"
                :options="sexOptions"
                :state="fieldState('biological_sex')"
              />
              <b-form-invalid-feedback>{{ firstError('biological_sex') }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="6" md="3">
            <b-form-group>
              <label class="form-label">Celular</label>
              <b-form-input
                v-model="form.phone"
                v-mask="'(##) #####-####'"
                :state="fieldState('phone')"
              />
              <b-form-invalid-feedback>{{ firstError('phone') }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="6" md="3">
            <b-form-group>
              <label class="form-label">
                E-mail
                <span class="optional">(Opcional)</span>
              </label>
              <b-form-input
                v-model="form.email"
                type="email"
                :state="fieldState('email')"
              />
              <b-form-invalid-feedback>{{ firstError('email') }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Row 3: Descrição -->
        <b-row>
          <b-col cols="12">
            <b-form-group>
              <label class="form-label">
                Descrição
                <span class="optional">(Opcional)</span>
              </label>
              <b-form-textarea v-model="form.description" rows="4" />
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Footer actions -->
        <div class="d-flex justify-content-between align-items-center mt-4">
          <button type="button" class="btn-link-danger" @click="showDeleteModal">
            Excluir paciente
          </button>
          <b-button type="submit" variant="primary" :disabled="saving">
            <b-spinner v-if="saving" small class="mr-2" />
            Atualizar paciente
          </b-button>
        </div>
      </b-form>
    </b-card>

    <!-- Delete confirmation modal -->
    <DeletePatientModal
      :loading="deleting"
      @confirm="deletePatient"
      @cancel="$bvModal.hide('delete-patient-modal')"
    />

    <b-toaster name="b-toaster-top-right" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import patientService, { Patient, PatientPayload } from '@/services/patientService'
import DeletePatientModal from '@/components/DeletePatientModal.vue'

export default Vue.extend({
  name: 'PatientEditView',
  components: { DeletePatientModal },

  data() {
    return {
      patient: null as Patient | null,
      loading: false,
      saving: false,
      deleting: false,
      errors: {} as Record<string, string[]>,
      form: null as PatientPayload | null,
      sexOptions: [
        { value: 'Masculino', text: 'Masculino' },
        { value: 'Feminino', text: 'Feminino' },
        { value: 'Outro', text: 'Outro' }
      ]
    }
  },

  created() {
    this.fetchPatient()
  },

  methods: {
    fieldState(field: string): boolean | null {
      if (this.errors[field]) return false
      return null
    },

    firstError(field: string): string {
      return this.errors[field]?.[0] || ''
    },

    async fetchPatient() {
      this.loading = true
      try {
        const { data } = await patientService.show(Number(this.$route.params.id))
        this.patient = data.data
        // Convert birth_date from d/m/Y to Y-m-d for the date input
        const [day, month, year] = data.data.birth_date.split('/')
        this.form = {
          name:           data.data.name,
          cpf:            data.data.cpf,
          rg:             data.data.rg,
          birth_date:     `${year}-${month}-${day}`,
          biological_sex: data.data.biological_sex,
          phone:          data.data.phone,
          email:          data.data.email || '',
          description:    data.data.description || ''
        }
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
    },

    async submit() {
      if (!this.form || !this.patient) return
      this.errors = {}
      this.saving = true
      try {
        await patientService.update(this.patient.id, this.form)
        this.$router.push({ name: 'patients', query: { toast: 'Paciente editado com sucesso!' } })
      } catch (err: any) {
        if (err.response?.status === 422) {
          this.errors = err.response.data.errors || {}
          this.$bvToast.toast('Verifique os erros no formulário.', {
            title: 'Erro de validação',
            variant: 'danger',
            autoHideDelay: 4000,
            toaster: 'b-toaster-top-right',
            solid: true
          })
        } else {
          this.$bvToast.toast(err.userMessage || 'Erro ao atualizar paciente.', {
            title: 'Erro',
            variant: 'danger',
            autoHideDelay: 5000,
            toaster: 'b-toaster-top-right',
            solid: true
          })
        }
      } finally {
        this.saving = false
      }
    },

    showDeleteModal() {
      this.$bvModal.show('delete-patient-modal')
    },

    async deletePatient() {
      if (!this.patient) return
      this.deleting = true
      try {
        await patientService.destroy(this.patient.id)
        this.$bvModal.hide('delete-patient-modal')
        this.$router.push({ name: 'patients', query: { toast: 'Paciente excluído com sucesso!' } })
      } catch (err: any) {
        this.$bvToast.toast(err.userMessage || 'Erro ao excluir paciente.', {
          title: 'Erro',
          variant: 'danger',
          autoHideDelay: 5000,
          toaster: 'b-toaster-top-right',
          solid: true
        })
      } finally {
        this.deleting = false
      }
    }
  }
})
</script>
