import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk"
import { KERNEL_V3_1, getEntryPoint } from "@zerodev/sdk/constants"
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator"
import { http, createPublicClient } from "viem"
import { sepolia } from "viem/chains"

const ZERODEV_RPC = 'https://rpc.zerodev.app/api/v3/fe89176a-464e-4ba5-8d28-690b71d56a7a/chain/11155111'

export const setupKernelClient = async (signer: any): Promise<any> => {
  const chain = sepolia
  const entryPoint = getEntryPoint("0.7")
  const kernelVersion = KERNEL_V3_1

  const publicClient = createPublicClient({
    transport: http(ZERODEV_RPC),
    chain,
  })

  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer,
    entryPoint,
    kernelVersion,
  })

  const account = await createKernelAccount(publicClient, {
    plugins: { sudo: ecdsaValidator },
    entryPoint,
    kernelVersion,
  })

  const zerodevPaymaster = createZeroDevPaymasterClient({
    chain,
    transport: http(ZERODEV_RPC),
  })

  const kernelClient = createKernelAccountClient({
    account,
    chain,
    bundlerTransport: http(ZERODEV_RPC),
    client: publicClient,
    paymaster: {
      getPaymasterData(userOperation) {
        return zerodevPaymaster.sponsorUserOperation({ userOperation })
      },
    },
  })

  return { kernelClient, accountAddress: kernelClient.account.address }
}
