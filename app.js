const { createApp, ref } = Vue

const app = createApp({
  setup() {
    const newEvent = ref(false)
    const editEvent = ref(false)
    const title = ref('')
    const titleEdited = ref('')
    const description = ref('')
    const descriptionEdited = ref('')
    const type = ref('')
    const typeEdited = ref('')
    const eventTypes = ref(['CLASS', 'GAMES', 'PARTY', 'SHOW', 'OTHER'])
    const date = ref()
    const dateEdited = ref()
    const events = ref([])
    const toast = PrimeVue.useToast()
    const confirm = PrimeVue.useConfirm()
    const hasErrors = ref(false)
    return {
      newEvent, editEvent, title, titleEdited, description, descriptionEdited, type, typeEdited, eventTypes, 
      date, dateEdited, events, toast, confirm, hasErrors
    }
  },
  methods: {
    save() {
      if(this.title === "" || this.type === '' || this.date === null || this.description === '') {
          this.hasErrors = true
      }
      else {
          const storage = localStorage.getItem("events")
          let index = 1
          if(storage !== null) {                    
              index = JSON.parse(storage).length + 1
          }
          const event = {
              id: index,
              title: this.title,
              date: this.date,
              type: this.type,
              description: this.description
          }
          this.events.push(event)
          localStorage.setItem("events", JSON.stringify(this.events))
          this.toast.add({ severity: "success", summary: "Message", detail: "Event was saved successfully", life: 3000 })
          this.clearNewEvent()
      }
    },
    edit(id) {
      this.editEvent = true
      const editedEvent = this.events.find((event) => event.id === id)
      this.id = id
      this.titleEdited = editedEvent.title
      this.dateEdited = new Date(editedEvent.date).toLocaleDateString()
      this.typeEdited = editedEvent.type
      this.descriptionEdited = editedEvent.description
    },
    update() {
      if(this.titleEdited === "" || this.typeEdited === '' || this.dateEdited === null || this.descriptionEdited === '') {
        this.hasErrors = true
      }
      else {
        this.events.map(event => {
          if(event.id === this.id) {
            event.title = this.titleEdited
            event.type = this.typeEdited
            event.date = this.dateEdited
            event.description = this.descriptionEdited
            localStorage.setItem("events", JSON.stringify(this.events))
            this.toast.add({ severity: "info", summary: "Message", detail: "Event was updated successfully", life: 3000 })
            this.clearEditEvent()
          }
        })
      }
    },
    deleteEvent(id) {
      this.confirm.require({
        message: 'Do you really want to delete this event?',
        header: 'Delete Event',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
          this.events = this.events.filter(event => event.id !== id)
          localStorage.setItem("events", JSON.stringify(this.events))
          this.toast.add({ severity: "error", summary: "Message", detail: "Event was deleted successfully", life: 3000 })
        }
      })
    },
    clearNewEvent() {
      this.title = ''
      this.type = ''
      this.date = null
      this.description = ''
      this.newEvent = false
      this.hasErrors = false
    },
    clearEditEvent() {
      this.titleEdited = ''
      this.typeEdited = ''
      this.dateEdited = null
      this.descriptionEdited = ''
      this.editEvent = false
      this.hasErrors = false
    }
  },
  mounted() {
    const storage = localStorage.getItem("events")
    if(storage !== null) {
      this.events = JSON.parse(storage)      
    }    
  }
})

app.use(PrimeVue.Config, {
  theme: {
    preset: PrimeVue.Themes.Aura
  }
})
app.use(PrimeVue.ToastService)
app.use(PrimeVue.UseConfirm)
app.use(PrimeVue.ConfirmationService)

app.component("p-panel", PrimeVue.Panel)
app.component("p-button", PrimeVue.Button)
app.component("p-dialog", PrimeVue.Dialog)
app.component("p-inputtext", PrimeVue.InputText)
app.component("p-textarea", PrimeVue.Textarea)
app.component("p-select", PrimeVue.Select)
app.component("p-message", PrimeVue.Message)
app.component("p-toast", PrimeVue.Toast)
app.component("p-confirmdialog", PrimeVue.ConfirmDialog)
app.component("p-datepicker", PrimeVue.DatePicker)
app.component("p-card", PrimeVue.Card)

app.mount('#app')