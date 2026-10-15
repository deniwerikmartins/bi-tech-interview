import { shallowMount } from '@vue/test-utils'
import PatientsView from '@/views/PatientsView.vue'
import patientService from '@/services/patientService'

// Mock the entire patient service module
jest.mock('@/services/patientService')

const mockPatients = [
  {
    id: 1,
    name: 'João da Silva',
    cpf: '123.456.789-09',
    rg: '12.345.678-9',
    birth_date: '15/05/1990',
    biological_sex: 'Masculino',
    phone: '(11) 91234-5678',
    email: 'joao@example.com',
    description: null,
    created_at: '01/01/2024 10:00',
    updated_at: '01/01/2024 10:00'
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    cpf: '987.654.321-00',
    rg: '98.765.432-1',
    birth_date: '20/08/1985',
    biological_sex: 'Feminino',
    phone: '(21) 98765-4321',
    email: null,
    description: null,
    created_at: '01/01/2024 10:00',
    updated_at: '01/01/2024 10:00'
  }
]

const mockPaginatedResponse = {
  data: {
    data: mockPatients,
    meta: { current_page: 1, last_page: 1, per_page: 10, total: 2 },
    links: { first: '', last: '', prev: null, next: null }
  }
}

const mockRouter = { push: jest.fn(), replace: jest.fn() }
const mockRoute  = { query: {} }

describe('PatientsView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(patientService.list as jest.Mock).mockResolvedValue(mockPaginatedResponse)
  })

  const factory = () =>
    shallowMount(PatientsView, {
      mocks: {
        $router: mockRouter,
        $route: mockRoute,
        $bvToast: { toast: jest.fn() }
      },
      stubs: {
        'b-button': { template: '<button @click="$emit(\'click\')"><slot /></button>' },
        'b-card': { template: '<div><slot /></div>' },
        'b-table': {
          template: '<table><tbody><tr v-for="item in items" :key="item.id"><td>{{ item.name }}</td></tr></tbody></table>',
          props: ['items', 'fields']
        },
        'b-spinner': { template: '<span class="spinner-stub" />' },
        'b-form-input': { template: '<input />' },
        'b-pagination': { template: '<nav />' },
        'b-toaster': true,
        'b-icon': true
      }
    })

  it('renders the page title', () => {
    const wrapper = factory()
    expect(wrapper.find('h1.page-title').text()).toBe('Pacientes')
  })

  it('calls patientService.list on created', () => {
    factory()
    expect(patientService.list).toHaveBeenCalledTimes(1)
    expect(patientService.list).toHaveBeenCalledWith({
      search: undefined,
      page: 1,
      per_page: 10
    })
  })

  it('shows loading spinner while fetching', () => {
    // list never resolves so loading stays true
    ;(patientService.list as jest.Mock).mockReturnValue(new Promise(() => {}))
    const wrapper = factory()
    expect(wrapper.find('.spinner-stub').exists()).toBe(true)
  })

  it('renders patient rows after successful fetch', async () => {
    const wrapper = factory()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).patients).toHaveLength(2)
    expect((wrapper.vm as any).patients[0].name).toBe('João da Silva')
  })

  it('navigates to create view when "Novo paciente" is clicked', async () => {
    const wrapper = factory()
    await wrapper.find('button').trigger('click')
    expect(mockRouter.push).toHaveBeenCalledWith('/pacientes/novo')
  })

  it('shows empty state message when no patients returned', async () => {
    ;(patientService.list as jest.Mock).mockResolvedValue({
      data: {
        data: [],
        meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
        links: {}
      }
    })
    const wrapper = factory()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Nenhum paciente encontrado')
  })

  it('sets search and refetches on input', async () => {
    jest.useFakeTimers()
    const wrapper = factory()
    await wrapper.vm.$nextTick()

    ;(wrapper.vm as any).search = 'Maria'
    ;(wrapper.vm as any).onSearchInput()
    jest.runAllTimers()

    expect(patientService.list).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: 'Maria' })
    )
    jest.useRealTimers()
  })
})
