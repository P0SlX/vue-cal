<template lang="pug">
.documentation.page-container
  //- Examples.
  examples(:locales-list="localesList")
</template>

<script>
import SshPre from 'simple-syntax-highlighter'
import 'simple-syntax-highlighter/dist/sshpre.css'
import VueCal from '@/vue-cal/index.vue'
import HighlightMessage from './components/highlight-message.vue'
import TodoListItem from './components/todo-list-item.vue'
import MainDemo from './main-demo.vue'
import Examples from './examples.vue'
import Api from './api.vue'
import ReleaseNotes from './release-notes.vue'
import '@/scss/documentation.scss'

const localesList = [
  { code: 'sq', label: 'Albanian' },
  { code: 'ar', label: 'Arabic' },
  { code: 'bn', label: 'Bangla' },
  { code: 'bs', label: 'Bosnian' },
  { code: 'bg', label: 'Bulgarian' },
  { code: 'ca', label: 'Catalan' },
  { code: 'cs', label: 'Czech' },
  { code: 'zh-cn', label: 'Chinese (Simplified)' },
  { code: 'zh-hk', label: 'Chinese (Traditional)' },
  { code: 'hr', label: 'Croatian' },
  { code: 'da', label: 'Danish' },
  { code: 'nl', label: 'Dutch' },
  { code: 'en', label: 'English' },
  { code: 'et', label: 'Estonian' },
  { code: 'fa', label: 'Farsi' },
  { code: 'fr', label: 'French' },
  { code: 'ka', label: 'Georgian' },
  { code: 'de', label: 'German' },
  { code: 'el', label: 'Greek' },
  { code: 'he', label: 'Hebrew' },
  { code: 'hu', label: 'Hungarian' },
  { code: 'is', label: 'Icelandic' },
  { code: 'it', label: 'Italian' },
  { code: 'id', label: 'Indonesian' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'lt', label: 'Lithuanian' },
  { code: 'mn', label: 'Mongolian' },
  { code: 'no', label: 'Norwegian' },
  { code: 'pl', label: 'Polish' },
  { code: 'pt-br', label: 'Portuguese Brasilian' },
  { code: 'ro', label: 'Romanian' },
  { code: 'ru', label: 'Russian' },
  { code: 'sr', label: 'Serbian' },
  { code: 'sk', label: 'Slovak' },
  { code: 'sl', label: 'Slovenian' },
  { code: 'es', label: 'Spanish' },
  { code: 'sv', label: 'Swedish' },
  { code: 'tr', label: 'Turkish' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'vi', label: 'Vietnamese' }
]

export default {
  components: {
    VueCal,
    SshPre,
    HighlightMessage,
    TodoListItem,
    MainDemo,
    Examples,
    Api,
    ReleaseNotes
  },

  data: () => ({
    localesList
  }),

  computed: {
    nowFormatted () {
      return Date.prototype.format && (new Date()).format('YYYY{MM}DD')
    }
  }
}
</script>

<style lang="scss">
.w-tabs__content-wrap {flex-grow: 1;}

.highlight-box {
  background: linear-gradient(45deg, #ecf8f1, rgba(#fff, 0));
  padding: 16px;
  border-radius: 8px;

  .w-icon.bolt {
    width: 68px;
    height: 68px;
    background-color: rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media screen and (max-width: 830px) {
  .w-app .vs-d-block {display: block;}
}
</style>
