"use client"

import { APIErrorsSource, Settings, UserProfile } from "@/types"
import {
  deleteWalletApi,
  getUserProfile,
  getUserProfileWithTokenAPI,
} from "@/utils/api/auth"
import useLocalStorageState from "@/utils/hooks"
import { AxiosError } from "axios"
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { ErrorsContext } from "./errorsProvider"
import { getRemainingClaimsAPI, getWeeklyChainClaimLimitAPI } from "@/utils/api"
import {
  useFastRefresh,
  useMediumRefresh,
  useRefreshWithInitial,
} from "@/utils/hooks/refresh"
import { FAST_INTERVAL, IntervalType } from "@/constants"
import { useWalletAccount } from "@/utils/wallet"
import { NullCallback } from "@/utils"
import { Address, isAddressEqual } from "viem"
import { useDisconnect } from "wagmi"

export const UserProfileContext = createContext<
  Partial<Settings> & {
    userProfile: UserProfile | null
    refreshUserProfile:
      | ((address: string, signature: string) => Promise<void>)
      | null
    onWalletLogin: (userToken: string, userProfile: UserProfile) => void
    loading: boolean
    userProfileLoading: boolean
    nonEVMWalletAddress: string
    setNonEVMWalletAddress: (address: string) => void
    userToken: string | null
    updateUsername: (username: string) => void
    holdUserLogout: boolean
    setHoldUserLogout: (arg: boolean) => void
    deleteWallet: (address: Address) => Promise<void>
    addNewWallet: (address: Address, pk: number) => void
    logout: Function
    updateProfile: (arg: UserProfile) => void
  }
>({
  userProfile: null,
  isGasTapAvailable: true,
  refreshUserProfile: null,
  loading: false,
  tokentapRoundClaimLimit: 0,
  gastapRoundClaimLimit: 0,
  userProfileLoading: false,
  nonEVMWalletAddress: "",
  userToken: null,
  onWalletLogin: NullCallback,
  holdUserLogout: false,
  setHoldUserLogout: NullCallback,
  setNonEVMWalletAddress: NullCallback,
  updateUsername: NullCallback,
  addNewWallet: NullCallback,
  deleteWallet: async () => {},
  logout: NullCallback,
  updateProfile: NullCallback,
})

export const UserContextProvider: FC<
  PropsWithChildren & { initial: UserProfile | null }
> = ({ children, initial }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initial)
  const [loading, setLoading] = useState(false)
  const [userToken, setToken] = useLocalStorageState("userToken")
  const [holdUserLogout, setHoldUserLogout] = useState(false)

  const { address, isConnected } = useWalletAccount()
  const { disconnect } = useDisconnect()

  const { addError } = useContext(ErrorsContext)

  const [remainingClaims, setRemainingClaims] = useState<number | null>(null)
  const [userProfileLoading, setUserProfileLoading] = useState(false)
  const [nonEVMWalletAddress, setNonEVMWalletAddress] = useState("")

  const onWalletLogin = (userToken: string, userProfile: UserProfile) => {
    setUserProfile(userProfile)
    setToken(userToken)
  }

  const updateUsername = (username: string) => {
    setUserProfile({
      ...userProfile!,
      username,
    })
  }

  const refreshUserProfile = async (address: string, signature: string) => {
    setLoading(true)
    getUserProfile(address, signature)
      .then((refreshedUserProfile: UserProfile) => {
        setUserProfile(refreshedUserProfile)
        setToken(refreshedUserProfile.token)
        return refreshedUserProfile
      })
      .catch((ex: AxiosError) => {
        if (ex.response?.status === 403 || ex.response?.status === 409) {
          addError({
            source: APIErrorsSource.BRIGHTID_CONNECTION_ERROR,
            message: (ex.response as any).data.message,
            statusCode: ex.response.status,
          })
        }
        throw ex
      })
      .finally(() => setLoading(false))
  }

  const addNewWallet = (address: Address, pk: number) => {
    if (!userProfile) return

    if (
      userProfile.wallets.find((item) => isAddressEqual(item.address, address))
    )
      return

    userProfile.wallets.push({
      walletType: "EVM",
      pk,
      address,
    })

    setUserProfile({ ...userProfile })
  }

  useRefreshWithInitial(
    () => {
      const getUserProfileWithToken = async () => {
        setUserProfileLoading(true)
        try {
          const userProfileWithToken: UserProfile =
            await getUserProfileWithTokenAPI(userToken!)
          setUserProfile(userProfileWithToken)

          document.cookie = `userToken=${userToken!};path=/;`
        } finally {
          setUserProfileLoading(false)
        }
      }

      document.cookie = "userToken=" + userToken + ";path=/;"

      if (userToken) {
        getUserProfileWithToken()
      }
    },
    FAST_INTERVAL,
    [userToken, setUserProfile]
  )

  const deleteWallet = async (address: Address) => {
    if (!userProfile || !userToken) return
    const selectedWalletIndex = userProfile.wallets.findIndex((wallet) =>
      isAddressEqual(wallet.address, address)
    )

    const selectedWallet = userProfile.wallets[selectedWalletIndex]

    if (!selectedWallet) return

    await deleteWalletApi(userToken, selectedWallet?.pk)

    userProfile.wallets.splice(selectedWalletIndex, 1)

    setUserProfile({ ...userProfile })
  }

  const logout = () => {
    disconnect?.()
    localStorage.clear()
    document.cookie = "userToken=;path=/;"
    setUserProfile(null)
    setToken("")
  }

  useEffect(() => {
    if (holdUserLogout || !userToken || !userProfile) {
      // if (isConnected && !userToken) {
      //   disconnect?.();
      // }
      return
    }

    if (isConnected && isAddressEqual(userProfile.walletAddress, address!))
      return

    const timeout = setTimeout(() => {
      disconnect?.()
      localStorage.removeItem("userToken")
      document.cookie = "userToken=;path=/;"
      setUserProfile(null)
      setToken("")
    }, 100)

    return () => {
      clearTimeout(timeout)
    }
  }, [
    userToken,
    setToken,
    isConnected,
    holdUserLogout,
    userProfile,
    address,
    disconnect,
  ])

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        onWalletLogin,
        refreshUserProfile,
        loading,
        userToken,
        userProfileLoading,
        nonEVMWalletAddress,
        setNonEVMWalletAddress,
        updateUsername,
        updateProfile: (userProfile) => setUserProfile(userProfile),
        holdUserLogout,
        setHoldUserLogout,
        deleteWallet,
        addNewWallet,
        logout,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export const useUserProfileContext = () => useContext(UserProfileContext)
