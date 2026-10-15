<template>
  <div>
    <!-- Breadcrumb -->
    <b-breadcrumb class="mb-4">
      <b-breadcrumb-item :to="{ name: 'patients' }">Pacientes</b-breadcrumb-item>
      <b-breadcrumb-item active>Novo paciente</b-breadcrumb-item>
    </b-breadcrumb>

    <b-card>
      <h2 class="mb-4" style="font-size:1.25rem; font-weight:700;">Cadastro de novo paciente</h2>
      <hr class="mt-0 mb-4" />

      <b-form @submit.prevent="submit">
        <!-- Row 1: Nome / CPF / RG -->
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group>
              <label class="form-label">Nome completo</label>
              <b-form-input
                v-model="form.name"
                placeholder="Descrever"
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
                placeholder="000.000.000-00"
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
                placeholder="00.000.000-0"
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
                placeholder="(00) 00000-0000"
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
                placeholder="Descrever"
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
              <b-form-textarea
                v-model="form.description"
                placeholder="Descrever"
                rows="4"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Footer actions -->
        <div class="d-flex justify-content-between align-items-center mt-4">
          <button type="button" class="btn-link-danger" @click="$router.push({ name: 'patients' })">
            Cancelar
          </button>
          <b-button type="submit" variant="primary" :disabled="saving">
            <b-spinner v-if="saving" small class="mr-2" />
            Salvar paciente
          </b-button>
        </div>
      </b-form>
    </b-card>

    <b-toaster name="b-toaster-top-right" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import patientService, { PatientPayload } from '@/services/patientService'

export default Vue.extend({
  name: 'PatientCreateView',

  data() {
    return {
      saving: false,
      errors: {} as Record<string, string[]>,
      form: {
        name: '',
        cpf: '',
        rg: '',
        birth_date: '',
        biological_sex: '',
        phone: '',
        email: '',
        description: ''
      } as PatientPayload,
      sexOptions: [
        { value: '', text: 'Selecionar' },
        { value: 'Masculino', text: 'Masculino' },
        { value: 'Feminino', text: 'Feminino' },
        { value: 'Outro', text: 'Outro' }
      ]
    }
  },

  methods: {
    fieldState(field: string): boolean | null {
      if (this.errors[field]) return false
      return null
    },

    firstError(field: string): string {
      return this.errors[field]?.[0] || ''
    },

    async submit() {
      this.errors = {}

      // Client-side required check for immediate UX feedback
      const required = ['name', 'cpf', 'rg', 'birth_date', 'biological_sex', 'phone'] as const
      let hasError = false
      for (const field of required) {
        if (!this.form[field]) {
          this.errors[field] = ['Campo obrigatório']
          hasError = true
        }
      }

      if (hasError) {
        this.$bvToast.toast('Preencha os campos obrigatórios para salvar!', {
          title: 'Atenção',
          variant: 'danger',
          autoHideDelay: 4000,
          toaster: 'b-toaster-top-right',
          solid: true
        })
        return
      }

      this.saving = true
      try {
        await patientService.store(this.form)
        this.$router.push({ name: 'patients', query: { toast: 'Paciente cadastrado com sucesso!' } })
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
          this.$bvToast.toast(err.userMessage || 'Erro ao salvar paciente.', {
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
    }
  }
})
</script>
