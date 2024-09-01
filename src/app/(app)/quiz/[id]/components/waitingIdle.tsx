import { FC } from "react"

const WaitingIdle: FC<{}> = () => {
  return (
    <div className="mt-20 text-center">
      <p className="text-lg font-semibold text-white"> Hang tight!</p>

      <p className="mt-5 text-gray100">
        the quiz begins as soon as everyone’s in.
      </p>
    </div>
  )
}

export default WaitingIdle
