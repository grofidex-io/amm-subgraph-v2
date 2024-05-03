import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  CancelCommunity,
  CancelTier,
  CancelWhiteList,
  ClaimGiveBack,
  ClaimToken,
  CommitCommunity,
  CommitTier,
  CommitWhiteList,
  Initialized,
  Refund,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/LaunchPad/LaunchPad"

export function createCancelCommunityEvent(
  committer: Address,
  amount: BigInt
): CancelCommunity {
  let cancelCommunityEvent = changetype<CancelCommunity>(newMockEvent())

  cancelCommunityEvent.parameters = new Array()

  cancelCommunityEvent.parameters.push(
    new ethereum.EventParam("committer", ethereum.Value.fromAddress(committer))
  )
  cancelCommunityEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return cancelCommunityEvent
}

export function createCancelTierEvent(
  committer: Address,
  tierId: BigInt,
  amount: BigInt
): CancelTier {
  let cancelTierEvent = changetype<CancelTier>(newMockEvent())

  cancelTierEvent.parameters = new Array()

  cancelTierEvent.parameters.push(
    new ethereum.EventParam("committer", ethereum.Value.fromAddress(committer))
  )
  cancelTierEvent.parameters.push(
    new ethereum.EventParam("tierId", ethereum.Value.fromUnsignedBigInt(tierId))
  )
  cancelTierEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return cancelTierEvent
}

export function createCancelWhiteListEvent(
  committer: Address,
  amount: BigInt
): CancelWhiteList {
  let cancelWhiteListEvent = changetype<CancelWhiteList>(newMockEvent())

  cancelWhiteListEvent.parameters = new Array()

  cancelWhiteListEvent.parameters.push(
    new ethereum.EventParam("committer", ethereum.Value.fromAddress(committer))
  )
  cancelWhiteListEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return cancelWhiteListEvent
}

export function createClaimGiveBackEvent(
  committer: Address,
  amount: BigInt
): ClaimGiveBack {
  let claimGiveBackEvent = changetype<ClaimGiveBack>(newMockEvent())

  claimGiveBackEvent.parameters = new Array()

  claimGiveBackEvent.parameters.push(
    new ethereum.EventParam("committer", ethereum.Value.fromAddress(committer))
  )
  claimGiveBackEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return claimGiveBackEvent
}

export function createClaimTokenEvent(
  committer: Address,
  amountU2U: BigInt,
  amountToken: BigInt,
  tierId: BigInt,
  isWhiteList: boolean,
  isCommunity: boolean
): ClaimToken {
  let claimTokenEvent = changetype<ClaimToken>(newMockEvent())

  claimTokenEvent.parameters = new Array()

  claimTokenEvent.parameters.push(
    new ethereum.EventParam("committer", ethereum.Value.fromAddress(committer))
  )
  claimTokenEvent.parameters.push(
    new ethereum.EventParam(
      "amountU2U",
      ethereum.Value.fromUnsignedBigInt(amountU2U)
    )
  )
  claimTokenEvent.parameters.push(
    new ethereum.EventParam(
      "amountToken",
      ethereum.Value.fromUnsignedBigInt(amountToken)
    )
  )
  claimTokenEvent.parameters.push(
    new ethereum.EventParam("tierId", ethereum.Value.fromUnsignedBigInt(tierId))
  )
  claimTokenEvent.parameters.push(
    new ethereum.EventParam(
      "isWhiteList",
      ethereum.Value.fromBoolean(isWhiteList)
    )
  )
  claimTokenEvent.parameters.push(
    new ethereum.EventParam(
      "isCommunity",
      ethereum.Value.fromBoolean(isCommunity)
    )
  )

  return claimTokenEvent
}

export function createCommitCommunityEvent(
  committer: Address,
  amount: BigInt
): CommitCommunity {
  let commitCommunityEvent = changetype<CommitCommunity>(newMockEvent())

  commitCommunityEvent.parameters = new Array()

  commitCommunityEvent.parameters.push(
    new ethereum.EventParam("committer", ethereum.Value.fromAddress(committer))
  )
  commitCommunityEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return commitCommunityEvent
}

export function createCommitTierEvent(
  committer: Address,
  tierId: BigInt,
  amount: BigInt
): CommitTier {
  let commitTierEvent = changetype<CommitTier>(newMockEvent())

  commitTierEvent.parameters = new Array()

  commitTierEvent.parameters.push(
    new ethereum.EventParam("committer", ethereum.Value.fromAddress(committer))
  )
  commitTierEvent.parameters.push(
    new ethereum.EventParam("tierId", ethereum.Value.fromUnsignedBigInt(tierId))
  )
  commitTierEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return commitTierEvent
}

export function createCommitWhiteListEvent(
  committer: Address,
  amount: BigInt
): CommitWhiteList {
  let commitWhiteListEvent = changetype<CommitWhiteList>(newMockEvent())

  commitWhiteListEvent.parameters = new Array()

  commitWhiteListEvent.parameters.push(
    new ethereum.EventParam("committer", ethereum.Value.fromAddress(committer))
  )
  commitWhiteListEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return commitWhiteListEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createRefundEvent(committer: Address, amount: BigInt): Refund {
  let refundEvent = changetype<Refund>(newMockEvent())

  refundEvent.parameters = new Array()

  refundEvent.parameters.push(
    new ethereum.EventParam("committer", ethereum.Value.fromAddress(committer))
  )
  refundEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return refundEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}
