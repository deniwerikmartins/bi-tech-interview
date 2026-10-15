import { shallowMount } from '@vue/test-utils'
import PatientEditView from '@/views/PatientEditView.vue'
import patientService from '@/services/patientService'

jest.mock('@/services/patientService')

const mockPatient = {
  id: 1,
  name: 'Alfredo Rhiel Madsen',
  cpf: '625.189.530-60',
  rg: '35.688.019-9',
  birth_date: '20/07/1996',
  biological_sex: 'Masculino',
  phone: '(11) 92853-5718',
  email: 'alfredo.rhiel@email.com',
  description: 'Lorem ipsum.',
  created_at: '01/01/2024 10:00',
  updated_at: '01/01/2024 10:00'
}

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
    template: '<select><slot /></select>',
    props: ['value', 'options', 'state']
  },
  'b-form-textarea': {
    template: '<textarea :value="value" />',
    props: ['value']
  },
  'b-form-invalid-feedback': { template: '<span><slot /></span>' },
  'b-button': { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  'b-spinner': true,
  'b-toaster': true,
  'DeletePatientModal': true
}

// Helper: mount and install spies on the real Bootstrap-Vue instances
const factory = () => {
  const wrapper = shallowMount(PatientEditView, {
    mocks: {
      $router: mockRouter,
      $route: { params: { id: '1' } }
    },
    stubs
  })
  const toastSpy = jest.fn()
  const modalShowSpy = jest.fn()
  const modalHideSpy = jest.fn()
  ;(wrapper.vm as any).$bvToast.toast = toastSpy
  ;(wrapper.vm as any).$bvModal.show = modalShowSpy
  ;(wrapper.vm as any).$bvModal.hide = modalHideSpy
  return { wrapper, toastSpy, modalShowSpy, modalHideSpy }
}

describe('PatientEditView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(patientService.show as jest.Mock).mockResolvedValue({ data: { data: mockPatient } })
  })

  it('calls patientService.show with the route id on created', () => {
    factory()
    expect(patientService.show).toHaveBeenCalledWith(1)
  })

  it('pre-fills form with patient data after fetch', async () => {
    const { wrapper } = factory()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const form = (wrapper.vm as any).form
    expect(form.name).toBe('Alfredo Rhiel Madsen')
    expect(form.cpf).toBe('625.189.530-60')
    expect(form.biological_sex).toBe('Masculino')
    expect(form.email).toBe('alfredo.rhiel@email.com')
  })

  it('converts birth_date from d/m/Y to Y-m-d for the date input', async () => {
    const { wrapper } = factory()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const form = (wrapper.vm as any).form
    expect(form.birth_date).toBe('1996-07-20')
  })

  it('calls patientService.update on submit', async () => {
    ;(patientService.update as jest.Mock).mockResolvedValue({ data: { data: mockPatient } })

    const { wrapper } = factory()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    await (wrapper.vm as any).submit()
    expect(patientService.update).toHaveBeenCalledWith(1, (wrapper.vm as any).form)
  })

  it('redirects with success toast after update', async () => {
    ;(patientService.update as jest.Mock).mockResolvedValue({ data: { data: mockPatient } })

    const { wrapper } = factory()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    await (wrapper.vm as any).submit()
    await wrapper.vm.$nextTick()

    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.objectContaining({ query: { toast: 'Paciente editado com sucesso!' } })
    )
  })

  it('calls patientService.destroy when deletePatient is invoked', async () => {
    ;(patientService.destroy as jest.Mock).mockResolvedValue({})

    const { wrapper } = factory()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    await (wrapper.vm as any).deletePatient()
    expect(patientService.destroy).toHaveBeenCalledWith(1)
  })

  it('redirects with success toast after delete', async () => {
    ;(patientService.destroy as jest.Mock).mockResolvedValue({})

    const { wrapper } = factory()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    await (wrapper.vm as any).deletePatient()
    await wrapper.vm.$nextTick()

    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.objectContaining({ query: { toast: 'Paciente excluído com sucesso!' } })
    )
  })

  it('opens delete modal when showDeleteModal is called', async () => {
    const { wrapper, modalShowSpy } = factory()
    await wrapper.vm.$nextTick()

    ;(wrapper.vm as any).showDeleteModal()
    expect(modalShowSpy).toHaveBeenCalledWith('delete-patient-modal')
  })
})
