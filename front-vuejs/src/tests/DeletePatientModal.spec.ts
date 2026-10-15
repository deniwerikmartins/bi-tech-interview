import { shallowMount } from '@vue/test-utils'
import DeletePatientModal from '@/components/DeletePatientModal.vue'

describe('DeletePatientModal', () => {
  const factory = (props = {}) =>
    shallowMount(DeletePatientModal, {
      propsData: { loading: false, ...props },
      stubs: { 'b-modal': true, 'b-button': true, 'b-spinner': true }
    })

  it('renders without errors', () => {
    const wrapper = factory()
    expect(wrapper.exists()).toBe(true)
  })

  it('emits cancel when cancel button is clicked', async () => {
    const wrapper = shallowMount(DeletePatientModal, {
      propsData: { loading: false },
      stubs: {
        'b-modal': {
          template: '<div><slot /></div>'
        },
        'b-button': {
          template: '<button @click="$emit(\'click\')"><slot /></button>'
        },
        'b-spinner': true
      }
    })

    const cancelBtn = wrapper.find('button.btn-link-danger')
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('shows spinner when loading prop is true', () => {
    const wrapper = shallowMount(DeletePatientModal, {
      propsData: { loading: true },
      stubs: {
        'b-modal': { template: '<div><slot /></div>' },
        'b-button': { template: '<button><slot /></button>' },
        'b-spinner': { template: '<span class="spinner-stub" />' }
      }
    })

    expect(wrapper.find('.spinner-stub').exists()).toBe(true)
  })

  it('does not show spinner when loading is false', () => {
    const wrapper = shallowMount(DeletePatientModal, {
      propsData: { loading: false },
      stubs: {
        'b-modal': { template: '<div><slot /></div>' },
        'b-button': { template: '<button><slot /></button>' },
        'b-spinner': { template: '<span class="spinner-stub" />' }
      }
    })

    expect(wrapper.find('.spinner-stub').exists()).toBe(false)
  })
})
