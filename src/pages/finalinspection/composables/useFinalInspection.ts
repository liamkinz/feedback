import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import type {
  Question,
  RatingQuestion,
  RatingOption,
  RespondentInfo,
} from '../types/finalInspection.types'

export function useFinalInspection() {
  const theme = useTheme()
  const isDark = computed(() => theme.global.current.value.dark)

  const questions = ref<Question[]>([
    {
      id: 'CC1',
      text: 'Asa sa mosunod ang labing mayo nga naghulagway sa imong kahibalo sa usa ka CC?',
      options: [
        {
          id: '1',
          label: '1. Nahibalo ko kung unsa ang CC ug nakita nako ang CC nini nga opisina.',
        },
        { id: '2', label: '2. Kabalo ko unsa ang CC pero WALA ko kakita sa CC ani nga opisina.' },
        {
          id: '3',
          label: '3. Nakat-unan lang nako ang CC dihang nakita nako ang CC nini nga opisina.',
        },
        {
          id: '4',
          label:
            "4. Wala ko kahibalo kung unsa ang CC ug wala koy nakita nili nga opisina. (Answer 'N/A' on CC2 and CC3)",
        },
      ],
    },
    {
      id: 'CC2',
      text: 'Kung nahibal-an nimo ang CC (gitubag ang 1-3 sa CC1), makaingon ka banga ang CC niini nga opisina mao ang?',
      options: [
        { id: '1', label: '1. Sayon nga makita' },
        { id: '2', label: '2. Medyodali nga makita' },
        { id: '3', label: '3. Lisud nga makita' },
        { id: '4', label: '4. Dili gyud makita' },
        { id: '5', label: '5. N/A' },
      ],
    },
    {
      id: 'CC3',
      text: 'Kung kahibalo ka sa CC (gitubag ang mga code 1-3 sa CC1), sa unsang paagi nakatabang sa imu ang CC sa imung transaksyon?',
      options: [
        { id: '1', label: '1. Nakatbang kayo' },
        { id: '2', label: '2. Medyo nakatbang' },
        { id: '3', label: '3. Wala nakatbang' },
        { id: '4', label: '4. N/A' },
      ],
    },
  ])

  const ratingQuestions = ref<RatingQuestion[]>([
    {
      id: 'SQD0',
      text: 'Kontento ko sa serbisyo nga akong na-avail.',
    },
    {
      id: 'SQD1',
      text: 'Gigahinan nako og igo nga oras alang sa akong transaksyon.',
    },
    {
      id: 'SQD2',
      text: 'Gisunod sa opisina ang mga requirements ug lakang sa transaksyon base sa gihatag nga impormasyon.',
    },
    {
      id: 'SQD3',
      text: 'Ang mgalakang (lakip ang pagbayad) nga kinahanglan nakong buhaton alang sa akong transaksyon sayon ug simple.',
    },
    {
      id: 'SQD4',
      text: 'Dali ranakonakita ang impormasyon kabahin sa akong transaksyon gikan sa opisina o sa ilang website.',
    },
    {
      id: 'SQD5',
      text: 'Nagbayad ko og makatarunganon nga kantidad sa mga bayronon alang sa akong transaksyon.',
    },
    {
      id: 'SQD6',
      text: 'Nabati nako nga ang opisina patas sa tanan o “walang palakasan” alang sa akong transaksyon.',
    },
    {
      id: 'SQD7',
      text: 'Gitratar ako nga matinahuron sa mga staff, ug (kung nangayo ko ogtabang) matinabangon sab ang mga staff.',
    },
    {
      id: 'SQD8',
      text: 'Nakuha nako ang akong gikinahanglan gikan sa opisina sa gobyerno, o (kongibalibaran) ang pagdumili sa hangyo igo nga gipasabutkanako.',
    },
  ])

  const ratingOptions = ref<RatingOption[]>([
    { id: '5', label: '5. Strongly Agree', value: 5 },
    { id: '4', label: '4. Agree', value: 4 },
    { id: '3', label: '3. Neither Agree nor Disagree', value: 3 },
    { id: '2', label: '2. Disagree', value: 2 },
    { id: '1', label: '1. Strongly Disagree', value: 1 },
  ])

  const selectedAnswers = ref<{ [key: string]: string }>({
    CC1: '',
    CC2: '',
    CC3: '',
  })

  const selectedRatings = ref<{ [key: string]: string }>({})

  const respondentInfo = ref<RespondentInfo>({
    clientType: '',
    date: '',
    sex: '',
    age: '',
    contactNumber: '',
    finalInspection: '',
  })

  const comments = ref('')

  // Add this before return {}
  const resetForm = () => {
    respondentInfo.value = {
      clientType: '',
      date: '',
      sex: '',
      age: '',
      contactNumber: '',
      finalInspection: '',
    }
    selectedAnswers.value = { CC1: '', CC2: '', CC3: '' }
    selectedRatings.value = {}
    comments.value = ''
  }

  return {
    theme,
    isDark,
    questions,
    ratingQuestions,
    ratingOptions,
    selectedAnswers,
    selectedRatings,
    respondentInfo,
    comments,
    resetForm,
  }
}
