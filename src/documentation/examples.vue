<template lang="pug">
.examples
  h2.title2.mt12.pt12
    a(href="#examples") Examples
    a#examples(name="examples")

  p.title3.
    In addition to all the examples below, you can try these common use cases on Codepen.
  p
    | If you have a doubt about the setup, check back the examples of the
    a.ml1(href="#installation") installation section
    | .

  p In this example, the event creation and drag ability are disabled to focus on edition and deletion.
  .example.my2.mxa
    vue-cal.vuecal--green-theme.vuecal--full-height-delete(
      selected-date="2018-11-19"
      :time-from="10 * 60"
      :time-to="23 * 60"
      :disable-views="['years', 'year']"
      hide-view-selector
      hide-weekends
      :editable-events="{ title: true, drag: false, resize: true, delete: true, create: false }"
      :events="editableEvents")
  ssh-pre(language="html-vue" label="Vue Template").
    &lt;vue-cal selected-date="2018-11-19"
             :time-from="10 * 60"
             :time-to="23 * 60"
             :disable-views="['years', 'year']"
             hide-view-selector
             hide-weekends
             :editable-events="{ title: true, drag: false, resize: true, delete: true, create: false }"
             :events="events"
             class="vuecal--full-height-delete"&gt;
    &lt;/vue-cal&gt;
  ssh-pre(language="js" label="Javascript").
    // In data.
    events: [
      {
        start: '2018-11-20 14:00',
        end: '2018-11-20 17:30',
        title: 'Boring event',
        content: '&lt;i class="icon material-icons"&gt;block&lt;/i&gt;&lt;br&gt;I am not draggable, not resizable and not deletable.',
        class: 'blue-event',
        deletable: false,
        resizable: false,
        draggable: false
      },
      // other events.
    ]
  ssh-pre(language="css" label="CSS").
    .vuecal__event {background-color: rgba(76, 172, 175, 0.35);}
</template>

<script>
import SshPre from 'simple-syntax-highlighter'
import 'simple-syntax-highlighter/dist/sshpre.css'
import VueCal from '@/vue-cal/index.vue'
import HighlightMessage from './components/highlight-message.vue'
import '@/scss/examples.scss'

const dailyHours = { from: 9 * 60, to: 18 * 60, class: 'business-hours' }

const events = [];

export default {
  components: { VueCal, SshPre, HighlightMessage },

  props: {
    localesList: { type: Array }
  },

  data: () => ({
    locale: 'zh-cn',
    splitsExample: {
      minCellWidth: 400,
      minSplitWidth: 0,
      stickySplitLabels: false,
      splitDays: [
        { id: 1, class: 'mom', label: 'Mom' },
        { id: 2, class: 'dad', label: 'Dad', hide: false },
        { id: 3, class: 'kid1', label: 'Kid 1' },
        { id: 4, class: 'kid2', label: 'Kid 2' },
        { id: 5, class: 'kid3', label: 'Kid 3' }
      ]
    },
    example1theme: 'green',
    minEventWidth: 0,
    timeCellHeight: 26,
    indicatorStyle: 'count',
    indicatorStyleOptions: [
      { label: 'count (default)', value: 'count' },
      { label: 'dash', value: 'dash' },
      { label: 'dot', value: 'dot' },
      { label: 'cell background', value: 'cell' }
    ],
    now: new Date(),
    logs: [],
    showDialog: false,
    showEventCreationDialog: false,
    showAllDayEvents: 0,
    shortEventsOnMonthView: false,
    events,
    selectedEvent: {},
    eventsCssClasses: [{ label: 'leisure' }, { label: 'sport' }, { label: 'health' }],
    selectedDate: null,
    activeView: 'week',
    logMouseEvents: false,
    snapToTime15: false,
    dragToCreateThreshold: 15,
    dragToCreateThresholdOpts: [{ label: '0' }, { label: '15' }],
    customDaySplitLabels: [
      { label: 'John', color: 'blue', class: 'split1' },
      { label: 'Tom', color: 'green', class: 'split2' },
      { label: 'Kate', color: 'orange', class: 'split3' },
      { label: 'Jess', color: 'red', class: 'split4' }
    ],
    editableEvents: [
      ...events.map(e => ({ ...e })), // Clone events when reusing, so events are independent.
      {
        start: '2018-11-20 14:00',
        end: '2018-11-20 17:30',
        title: 'Boring event',
        content: '<i class="w-icon material-icons">block</i><br>I am not draggable, not resizable and not deletable.',
        class: 'blue-event',
      },
      {
        start: '2018-11-20 14:30',
        end: '2018-11-20 17:30',
        title: 'AAAAAAAAAA',
        class: 'blue-event',
      }
    ],
    overlappingEvents: [
      ...events.map(e => ({ ...e })), // Clone events when reusing, so events are independent.
      {
        start: '2018-11-21 14:00',
        end: '2018-11-21 22:00',
        title: 'A big thing',
        content: '<i class="w-icon material-icons">sentiment_satisfied_alt</i>',
        class: 'health'
      },
      {
        start: '2018-11-21 16:00',
        end: '2018-11-21 19:00',
        title: 'Another thing',
        content: '<i class="w-icon material-icons">thumb_up</i>',
        class: 'blue-event'
      },
      {
        start: '2018-11-23 21:00',
        end: '2018-11-23 23:30',
        title: 'Eat pop corns',
        content: '<i class="w-icon material-icons">local_play</i>',
        class: 'leisure'
      },
      {
        start: '2018-11-23 21:00',
        end: '2018-11-23 23:30',
        title: 'Enjoy the movie',
        content: '<i class="w-icon material-icons">local_play</i>',
        class: 'leisure'
      }
    ],
    eventsCopy: [
      ...events.map(e => ({ ...e })), // Clone events when reusing, so events are independent.
      {
        start: '2018-11-21 12:00',
        end: '2018-11-21 12:30',
        title: 'Recall Dave',
        content: '<i class="w-icon material-icons">local_cafe</i>',
        class: 'leisure'
      },
      {
        start: '2018-11-23 21:00',
        end: '2018-11-23 23:30',
        title: 'Eat pop corns',
        content: '<i class="w-icon material-icons">local_play</i>',
        class: 'leisure'
      },
      {
        start: '2018-11-23 21:00',
        end: '2018-11-23 23:30',
        title: 'Enjoy the movie',
        content: '<i class="w-icon material-icons">local_play</i>',
        class: 'leisure'
      }
    ],
    eventsCopy2: [
      ...events.map(e => ({ ...e })) // Clone when reusing, so events are independent.
    ],
    eventsCopy3: [
      ...events.map(e => ({ ...e })) // Clone when reusing, so events are independent.
    ],
    multipleDayEvents: [
      {
        start: '2018-11-16 10:00',
        end: '2018-11-20 12:37',
        title: 'Running Marathon',
        content: '<i class="w-icon material-icons">directions_run</i>',
        class: 'sport'
      },
      {
        start: '2018-11-20 10:00',
        end: '2018-11-20 10:25',
        title: 'Drink water!',
        content: '<i class="w-icon material-icons">local_drink</i>',
        class: 'health drink-water'
      },
      {
        start: '2018-11-21 19:00',
        end: '2018-11-23 11:30',
        title: 'Trip to India',
        content: '<i class="w-icon material-icons">flight</i>',
        class: 'leisure'
      }
    ],
    recurringEvents: [],
    allDayEvents: [
      {
        start: '2019-02-12',
        end: '2019-02-12',
        title: 'Day off!',
        content: '<i class="w-icon material-icons">beach_access</i>',
        class: 'yellow-event',
        allDay: true
      },
      {
        start: '2019-02-14',
        end: '2019-02-14',
        title: 'Valentine\'s day',
        content: '<i class="w-icon material-icons">favorite_outline</i>',
        class: 'pink-event',
        allDay: true
      },
      {
        start: '2019-02-14',
        end: '2019-02-14',
        title: 'Need to go shopping',
        content: '<i class="w-icon material-icons">shopping_cart</i>',
        class: 'leisure',
        allDay: true
      },
      {
        start: '2019-02-11 10:35',
        end: '2019-02-11 11:30',
        title: 'Doctor appointment',
        content: '<i class="w-icon material-icons">local_hospital</i>',
        class: 'health',
        split: 1
      },
      {
        start: '2019-02-11 18:30',
        end: '2019-02-11 19:15',
        title: 'Dentist appointment',
        content: '<i class="w-icon material-icons">local_hospital</i>',
        class: 'health',
        split: 2
      },
      {
        start: '2019-02-12 18:30',
        end: '2019-02-12 20:30',
        title: 'Crossfit',
        content: '<i class="w-icon material-icons">fitness_center</i>',
        class: 'sport',
        split: 1
      },
      {
        start: '2019-02-13 11:00',
        end: '2019-02-13 13:00',
        title: 'Brunch with Jane',
        content: '<i class="w-icon material-icons">local_cafe</i>',
        class: 'leisure',
        split: 1
      },
      {
        start: '2019-02-13 19:30',
        end: '2019-02-13 23:00',
        title: 'Swimming lesson',
        content: '<i class="w-icon material-icons">pool</i>',
        class: 'sport',
        split: 2
      },
      {
        start: '2019-02-15 12:30',
        end: '2019-02-15 13:00',
        title: 'Macca\'s with Mark',
        content: '<i class="w-icon material-icons">fastfood</i>',
        class: 'leisure',
        split: 2
      },
      {
        start: '2019-02-15 21:00',
        end: '2019-02-15 23:30',
        title: 'Movie time',
        content: '<i class="w-icon material-icons">local_play</i>',
        class: 'leisure',
        split: 1
      }
    ],
    splitEvents: [
      ...events.map(e => ({ ...e })), // Clone events when reusing, so events are independent.
      {
        start: '2018-11-21 12:00',
        end: '2018-11-21 12:30',
        title: 'Recall Dave',
        content: '<i class="w-icon material-icons">local_cafe</i>',
        class: 'leisure',
        split: 1
      },
      {
        start: '2018-11-21 20:00',
        end: '2018-11-21 22:00',
        title: 'Salsa',
        content: '<i class="w-icon material-icons">directions_walk</i>',
        class: 'sport',
        split: 1
      },
      {
        start: '2018-11-23 21:00',
        end: '2018-11-23 23:30',
        title: 'Movie time',
        content: '<i class="w-icon material-icons">local_play</i>',
        class: 'leisure',
        split: 2
      }
    ],
    backgroundEvents: [
      ...events.map(e => ({ ...e })), // Clone events when reusing, so events are independent.
      {
        start: '2018-11-19 12:00',
        end: '2018-11-19 14:00',
        title: 'LUNCH',
        class: 'lunch',
        background: true
      },
      {
        start: '2018-11-20 12:00',
        end: '2018-11-20 14:00',
        title: 'LUNCH',
        class: 'lunch',
        background: true
      },
      {
        start: '2018-11-21 12:00',
        end: '2018-11-21 14:00',
        title: 'LUNCH',
        class: 'lunch',
        background: true
      },
      {
        start: '2018-11-22 12:00',
        end: '2018-11-22 14:00',
        title: 'LUNCH',
        class: 'lunch',
        background: true
      },
      {
        start: '2018-11-23 12:00',
        end: '2018-11-23 14:00',
        title: 'LUNCH',
        class: 'lunch',
        background: true
      }
    ],
    timelessEvents: [
      {
        start: '2018-11-21',
        end: '2018-11-21',
        title: 'Need to go shopping',
        content: '<i class="w-icon material-icons">shopping_cart</i>',
        class: 'leisure'
      },
      {
        start: '2018-11-21',
        end: '2018-11-21',
        title: 'Golf with John',
        content: '<i class="w-icon material-icons">golf_course</i>',
        class: 'sport'
      },
      {
        start: '2018-11-22',
        end: '2018-11-22',
        title: 'Dad\'s birthday!',
        content: '<i class="w-icon material-icons">cake</i>',
        class: 'sport'
      },
      {
        start: '2018-11-23',
        end: '2018-11-23',
        title: 'Black Friday',
        content: '<i class="w-icon material-icons">shopping_cart</i>',
        class: 'leisure'
      }
    ],
    eventsToDrag: [
      {
        start: '2018-11-21 14:00',
        end: '2018-11-21 16:30',
        title: 'Surgery',
        content: '<i class="w-icon material-icons">restaurant</i>',
        class: 'health',
        split: 2
      }
    ],
    eventsToPop: [
      {
        start: '2018-11-20 14:00',
        end: '2018-11-20 18:00',
        title: 'Need to go shopping',
        icon: 'shopping_cart',
        content: 'Click to see my shopping list',
        contentFull: 'My shopping list is rather long:<br><ul><li>Avocados</li><li>Tomatoes</li><li>Potatoes</li><li>Mangoes</li></ul>',
        class: 'leisure'
      },
      {
        start: '2018-11-22 10:00',
        end: '2018-11-22 15:00',
        title: 'Golf with John',
        icon: 'golf_course',
        content: 'Do I need to tell how many holes?',
        contentFull: 'Okay.<br>It will be a 18 hole golf course.',
        class: 'sport'
      }
    ],
    draggables: [
      {
        id: 1,
        title: 'Ext. Event 1',
        content: 'content 1',
        duration: 60
      },
      {
        id: 2,
        title: 'Ext. Event 2',
        content: 'content 2',
        duration: 30
      },
      {
        id: 3,
        title: 'Ext. Event 3',
        content: 'content 3'
      }
    ],
    deleteEventFunction: null,
    deleteDragEventFunction: null,
    specialDoctorHours: {
      1: { from: 8 * 60, to: 17 * 60, class: 'doctor-1', label: '<strong>Doctor 1</strong><br><em>Full day shift</em>' },
      2: { from: 9 * 60, to: 18 * 60, class: 'doctor-2', label: '<strong>Doctor 2</strong><br><em>Full day shift</em>' },
      3: [
        { from: 8 * 60, to: 12 * 60, class: 'doctor-1', label: '<strong>Doctor 1</strong><br><em>Morning shift</em>' },
        { from: 14 * 60, to: 19 * 60, class: 'doctor-3', label: '<strong>Doctor 3</strong><br><em>Afternoon shift</em>' }
      ],
      4: { from: 8 * 60, to: 17 * 60, class: 'doctor-1', label: '<strong>Doctor 1</strong><br><em>Full day shift</em>' },
      5: { from: 9 * 60, to: 18 * 60, class: 'doctor-3', label: '<strong>Doctor 3</strong><br><em>Full day shift</em>' },
      6: { from: 9 * 60, to: 18 * 60, class: 'doctor-2', label: '<strong>Doctor 2</strong><br><em>Full day shift</em>' },
      7: { from: 7 * 60, to: 20 * 60, class: 'closed', label: '<strong>Closed</strong>' }
    }
  }),

  methods: {
    logEvents (emittedEventName, params) {
      if (!this.logMouseEvents && emittedEventName.includes('event-mouse')) return

      this.logs.push({ name: emittedEventName, args: JSON.stringify(params) })
    },
    clearEventsLog () {
      this.logs = []
    },
    customEventsCount: events => events ? events.filter(e => e.class === 'leisure').length : 0,
    scrollToCurrentTime (vuecal) {
      const calendar = document.querySelector(`${vuecal} .vuecal__bg`)
      const hours = this.now.getHours() + this.now.getMinutes() / 60
      calendar.scrollTo({ top: hours * this.timeCellHeight, behavior: 'smooth' })
    },
    scrollToTop (vuecal) {
      const calendar = document.querySelector(`${vuecal} .vuecal__bg`)
      calendar.scrollTo({ top: 0, behavior: 'smooth' })
    },
    onEventClick (event, e) {
      this.selectedEvent = event
      this.showDialog = true
      e.stopPropagation()
    },
    cancelEventCreation () {
      this.closeCreationDialog()
      (this.deleteEventFunction || this.deleteDragEventFunction)()
    },
    closeCreationDialog () {
      this.showEventCreationDialog = false
      this.selectedEvent = {}
    },
    onEventCreate (event, deleteEventFunction) {
      this.selectedEvent = event
      this.showEventCreationDialog = true
      this.deleteEventFunction = deleteEventFunction

      return event
    },
    onEventDragStartCreate (event, deleteEventFunction) {
      this.selectedEvent = event
      this.deleteEventFunction = deleteEventFunction

      return event
    },
    customEventCreation () {
      let today = new Date(new Date().setHours(13, 15))
      // If today is on weekend subtract 2 days for the event to always be visible with hidden weekends.
      if (!today.getDay() || today.getDay() > 5) today = today.subtractDays(2)
      const dateTime = prompt('Create event on (YYYY-MM-DD HH:mm)', today.format('YYYY-MM-DD HH:mm'))
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateTime)) {
        this.$refs.vuecal.createEvent(dateTime, 120, { title: 'New Event', content: 'yay! 🎉', class: 'blue-event' })
      }
      else if (dateTime) alert('Wrong date format.')
    },
    overrideDateTexts () {
      // In Vue Cal documentation Chinese texts are loaded last.
      // Override Date texts with english for prototype formatting functions.
      setTimeout(this.$refs.vuecal.updateDateTexts, 3000)
    },
    onEventDragStart (e, draggable) {
      e.dataTransfer.setData('event', JSON.stringify(draggable))
      e.dataTransfer.setData('cursor-grab-at', e.offsetY)
    },
    onEventDrop ({ event, originalEvent, external }) {
      if (external) {
        const extEventToDeletePos = this.draggables.findIndex(item => item.id === originalEvent.id)
        if (extEventToDeletePos > -1) this.draggables.splice(extEventToDeletePos, 1)
      }
    }
  },

  computed: {
    reversedLogs () {
      return this.logs.slice(0).reverse()
    },
    todayFormattedNotWeekend () {
      let today = new Date(new Date().setHours(13, 15))
      // If today is on weekend subtract 2 days for the event to always be visible with hidden weekends.
      if (!today.getDay() || today.getDay() > 5) today = today.subtractDays(2)
      return today.format('YYYY-MM-DD HH:mm')
    },
    minDate () {
      return new Date().subtractDays(10)
    },
    maxDate () {
      return new Date().addDays(10)
    },
    specialHours: () => {
      const array = Array(5).fill('').reduce((obj, item, i) => (obj[i + 1] = dailyHours) && obj, {})
      array[3] = [
        { from: 9 * 60, to: 12 * 60, class: 'business-hours' },
        { from: 14 * 60, to: 18 * 60, class: 'business-hours' }
      ]
      return array
    }
  },

  created () {
    if (!HTMLElement.prototype.scrollTo) HTMLElement.prototype.scrollTo = function ({ top }) { this.scrollTop = top }
  }
}
</script>
