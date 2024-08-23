import Icon from "@/components/ui/Icon"
import { useQuizContext } from "@/context/quizProvider"
import { FC, useEffect } from "react"

const QuestionPrompt: FC = () => {
  const {
    stateIndex,
    answerQuestion,
    question: currentQuestion,
    previousQuestion,
    isRestTime,
  } = useQuizContext()

  const question = isRestTime ? previousQuestion : currentQuestion

  useEffect(() => {
    const onKeyPressed = (e: KeyboardEvent) => {
      if (isRestTime || !question?.isEligible) return
      if (e.key === "A") {
        answerQuestion(1)
      } else if (e.key === "B") {
        answerQuestion(2)
      } else if (e.key === "C") {
        answerQuestion(3)
      } else if (e.key === "D") {
        answerQuestion(4)
      }
    }

    document.addEventListener("keypress", onKeyPressed)

    return () => {
      document.removeEventListener("keypress", onKeyPressed)
    }
  }, [answerQuestion, isRestTime, question?.isEligible])

  return (
    <div className="mt-10">
      <h3 className="text-base font-normal">
        {stateIndex} - {question?.text}
      </h3>

      <div className="mt-10 grid grid-cols-2 gap-5 font-semibold">
        {question?.choices.map((item, key) => (
          <QuestionChoice title={item.text} index={item.id} key={key} />
        ))}
      </div>
    </div>
  )
}

export const indexesToABC: Record<number, string> = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
}

const QuestionChoice: FC<{ index: number; title: string }> = ({
  index,
  title,
}) => {
  const {
    answerQuestion,
    activeQuestionChoiceIndex,
    question,
    isRestTime,
    answersHistory,
  } = useQuizContext()

  return (
    <button
      onClick={() =>
        isRestTime || !question?.isEligible || answerQuestion(index)
      }
      className={`relative rounded-xl border-2 border-gray40 bg-gray20 py-3 text-center text-white transition-colors ${
        question &&
        answersHistory[question.id] &&
        answersHistory[question.id] !== index &&
        activeQuestionChoiceIndex === index
          ? "!border-error !bg-error/40"
          : ""
      } ${
        question &&
        answersHistory[question.id] === index &&
        activeQuestionChoiceIndex !== -1
          ? "!border-space-green !bg-dark-space-green"
          : ""
      } ${activeQuestionChoiceIndex === index ? "!border-gray100 bg-gray60" : ""} `}
    >
      <span>{title}</span>

      <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-gray70">
        <Icon
          iconSrc="/assets/images/quizTap/shift.png"
          width="16px"
          height="16px"
          alt="shift"
        />
        <span>{indexesToABC[index]}</span>
      </div>
    </button>
  )
}

export default QuestionPrompt
