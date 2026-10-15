import { shallowMount } from '@vue/test-utils'
import PatientCreateView from '@/views/PatientCreateView.vue'
import patientService from '@/services/patientService'

jest.mock('@/services/patientService')

const mockRouter = { push: jest.fn() }

const stubs = {
  'b-breadcrumb': true,
  'b-breadcrumb-item': true,
  'b-card': { template: '<div><slot /></div>' },
  'b-form': { template: '<form @submit.prevent="$emit(\'submit\')"><slot /></form>' },
  'b-row': { template: '<div><slot /></div>' },
  'b-col': { template: '<div><slot /></div>' },
  'b-form-group': { template: '<div><slot /></div>' },
  'b-form-input': {
    template: '<input :value="value" @input="$emit(\'input\', $event.target.value)" />',
    props: ['value', 'state']
  },
  'b-form-select': {
    template: '<select :value="value" @change="$emit(\'input\', $event.target.value)"><slot /></select>',
    props: ['value', 'options', 'state']
  },
  'b-form-textarea': {
    template: '<textarea :value="value" @input="$emit(\'input\', $event.target.value)" />',
    props: ['value']
  },
  'b-form-invalid-feedback': { template: '<span><slot /></span>' },
  'b-button': { template: '<button type="submit" @click="$emit(\'click\')"><slot /></button>' },
  'b-spinner': true,
  'b-toaster': true
}

// Helper: mount and install a toast spy on the instance
const factory = () => {
  const wrapper = shallowMount(PatientCreateView, {
    mocks: { $router: mockRouter, $route: { query: {} } },
    stubs
  })
  // Spy on the real $bvToast instance (installed by Bootstrap-Vue)
  const toastSpy = jest.fn()
  ;(wrapper.vm as any).$bvToast.toast = toastSpy
  return { wrapper, toastSpy }
}

describe('PatientCreateView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the form title', () => {
    const { wrapper } = factory()
    expect(wrapper.text()).toContain('Cadastro de novo paciente')
  })

  it('initialises form with empty fields', () => {
    const { wrapper } = factory()
    const form = (wrapper.vm as any).form
    expect(form.name).toBe('')
    expect(form.cpf).toBe('')
    expect(form.biological_sex).toBe('')
  })

  it('shows validation toast when submitting empty form', async () => {
    const { wrapper, toastSpy } = factory()
    await (wrapper.vm as any).submit()
    expect(toastSpy).toHaveBeenCalledWith(
      'Preencha os campos obrigatórios para salvar!',
      expect.objectContaining({ variant: 'danger' })
    )
  })

  it('does not call patientService.store when form is empty', async () => {
    const { wrapper } = factory()
    await (wrapper.vm as any).submit()
    expect(patientService.store).not.toHaveBeenCalled()
  })

  it('sets field errors when required fields are missing', async () => {
    const { wrapper } = factory()
    await (wrapper.vm as any).submit()
    const errors = (wrapper.vm as any).errors
    expect(errors.name).toBeDefined()
    expect(errors.cpf).toBeDefined()
    expect(errors.birth_date).toBeDefined()
    expect(errors.biological_sex).toBeDefined()
    expect(errors.phone).toBeDefined()
  })

  it('calls patientService.store with form data on valid submit', async () => {
    ;(patientService.store as jest.Mock).mockResolvedValue({ data: { data: { id: 1 } } })

    const { wrapper } = factory()
    const vm = wrapper.vm as any
    vm.form = {
      name: 'João da Silva',
      cpf: '123.456.789-09',
      rg: '12.345.678-9',
      birth_date: '1990-05-15',
      biological_sex: 'Masculino',
      phone: '(11) 91234-5678',
      email: '',
      description: ''
    }

    await vm.submit()
    expect(patientService.store).toHaveBeenCalledWith(vm.form)
  })

  it('redirects to patients list with success toast query param after store', async () => {
    ;(patientService.store as jest.Mock).mockResolvedValue({ data: { data: { id: 1 } } })

    const { wrapper } = factory()
    const vm = wrapper.vm as any
    vm.form = {
      name: 'João da Silva',
      cpf: '123.456.789-09',
      rg: '12.345.678-9',
      birth_date: '1990-05-15',
      biological_sex: 'Masculino',
      phone: '(11) 91234-5678',
      email: '',
      description: ''
    }

    await vm.submit()
    await wrapper.vm.$nextTick()

    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'patients' })
    )
  })

  it('sets server validation errors on 422 response', async () => {
    ;(patientService.store as jest.Mock).mockRejectedValue({
      response: {
        status: 422,
        data: { errors: { cpf: ['Este CPF já está cadastrado.'] } }
      }
    })

    const { wrapper } = factory()
    const vm = wrapper.vm as any
    vm.form = {
      name: 'João',
      cpf: '123.456.789-09',
      rg: '12.345.678-9',
      birth_date: '1990-05-15',
      biological_sex: 'Masculino',
      phone: '(11) 91234-5678',
      email: '',
      description: ''
    }

    await vm.submit()
    await wrapper.vm.$nextTick()

    expect(vm.errors.cpf).toEqual(['Este CPF já está cadastrado.'])
  })
})
