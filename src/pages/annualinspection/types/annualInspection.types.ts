export interface Question {
  id: string
  text: string
  options: {
    id: string
    label: string
  }[]
}

export interface RatingQuestion {
  id: string
  text: string
}

export interface RatingOption {
  id: string
  label: string
  value: number
}

export interface RespondentInfoAnnualInspection {
  clientType: string
  date: string
  sex: string
  age: string
  contactNumber: string
  annualInspection: string
}

export interface SurveyState {
  selectedAnswers: { [key: string]: string }
  selectedRatings: { [key: string]: string }
  respondentInfo: RespondentInfoAnnualInspection
  comments: string
}
