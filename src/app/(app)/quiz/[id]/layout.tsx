import { FC, PropsWithChildren } from "react"

import "./styles.scss"
import Header from "./components/header"
import { fetchQuizApi } from "@/utils/api"
import QuizContextProvider from "@/context/quizProvider"
import QuizTapSidebar from "./components/sidebar"

const QuizLayout: FC<PropsWithChildren & { params: { id: string } }> = async ({
  children,
  params,
}) => {
  const quiz = await fetchQuizApi(Number(params.id))
  let enrollment

  // if (new Date(quiz.startAt).getTime() - new Date().getTime() > 60000 * 5) {
  //   redirect("/quiz")
  // }

  return (
    <QuizContextProvider quiz={quiz}>
      <Header />

      <div className="mt-5 select-none flex flex-col-reverse gap-2 md:flex-row">
        {children}

        <QuizTapSidebar />
      </div>
    </QuizContextProvider>
  )
}

export default QuizLayout
