import { fetchQuizzesApi } from "@/utils/api"
import QuizItemPage from "./content"

export async function generateStaticParams() {
  const quizzes = await fetchQuizzesApi()

  return quizzes.results.map((quiz) => ({
    id: quiz.id.toString(),
  }))
}

const QuizPage = () => <QuizItemPage />

export default QuizPage
