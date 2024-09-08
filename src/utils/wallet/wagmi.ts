"use client"

import { cookieStorage, createStorage, http } from "wagmi"
import { supportedChains } from "@/constants/chains"
import { injected, safe, walletConnect } from "wagmi/connectors"
import { HttpTransport } from "viem"
import { createConfig } from "@privy-io/wagmi"

const getConnectorProviders = () => {
  return [
    injected({
      shimDisconnect: true,
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    }),
    safe(),
  ]
}

const transports: { [key: string]: HttpTransport } = {}

for (const chain of supportedChains) {
  transports[chain.id] = http()
}

export const config = createConfig({
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  chains: supportedChains as any,
  connectors: getConnectorProviders(),
  transports,
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
