import { FC, PropsWithChildren } from "react"
import { ErrorsProvider } from "./errorsProvider"
import { GlobalContextProvider } from "./globalProvider"
import { UserContextProvider } from "./userProfile"
import { Settings, UserProfile } from "@/types"
import WalletProvider from "./walletProvider"
import { cookies } from "next/headers"

export const WitsProvider: FC<PropsWithChildren> = async ({ children }) => {
  return (
    <ErrorsProvider>
      <GlobalContextProvider>
        <UserContextProvider>
          <WalletProvider>{children}</WalletProvider>
        </UserContextProvider>
      </GlobalContextProvider>
    </ErrorsProvider>
  )
}

export default WitsProvider
