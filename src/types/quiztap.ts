import { UserProfile } from "./auth"

export enum CompetitionStatus {
  NOT_STARTED = "not_started",
  HOLDING = "holding",
  FINISHED = "finished",
}

export type QuestionPreview = {
  number: number
  pk: number
}

export type QuestionResponse = {
  id: number
  competition: Competition
  choices: Choice[]
  number: number
  canBeShown: boolean
  answerCanBeShown: boolean
  isEligible: boolean
  text: string
  remainParticipantsCount: number
  totalParticipantsCount: number
  amountWonPerUser: number
}

export type Sponsor = {
  id: number
  description?: string
  image: string
  name: string
  link: string
}

export type Competition = {
  hintCount: number
  participantsCount: number
  id: number
  pk: number
  sponsors: Sponsor[]
  title: string
  questions: QuestionPreview[]
  userProfile: UserProfile
  details?: string
  createdAt: string
  startAt: string
  status: CompetitionStatus
  prizeAmount: number
  chain: number
  token: string
  tokenAddress: string
  discordUrl?: string
  twitterUrl?: string
  emailUrl?: string
  telegramUrl?: string
  image?: string
  restTimeSeconds: number
  tokenImageUrl?: string
  isActive: boolean
}

export type UserCompetition = {
  userProfile: UserProfile
  competition: number | Competition
  isWinner: boolean
  amountWon?: number
}

export type Question = {
  competition: number
  number: number
  answerTimeLimitSeconds: number
  text: string
}

export type Choice = {
  question: number
  text: string
  isCorrect?: boolean
  id: number
}

export type UserAnswer = {
  userProfile: number
  question: number
  selectedChoice: number
}

export type QuizAnswerQuestionResponse = {
  id: number
  userCompetition: UserCompetition

  selectedChoice: Choice
  question: number
}
