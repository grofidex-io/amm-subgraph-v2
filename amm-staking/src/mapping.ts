import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import {
  AddPool,
  Deposit,
  Withdraw,
  SetPool,
  AMMStake
} from "../generated/AMMStake/AMMStake";
import { Stake, PoolPackage, User } from "../generated/schema";

export function handleAddPool(event: AddPool): void {
  let pool = PoolPackage.load(event.params.pid.toString());
  if (pool === null) {
    pool = new PoolPackage(event.params.pid.toString());
  }
  pool.address = event.params.v3Pool.toHex();
  pool.startTime = event.params.startTime.toI32();
  pool.endTime = event.params.endTime.toI32();
  pool.tokenPerSecond = event.params.tokenPerSecond;
  let contract = AMMStake.bind(event.address);
  let poolInfo = contract.poolInfo(event.params.pid);
  pool.token0 = poolInfo.getToken0().toHex();
  pool.token1 = poolInfo.getToken1().toHex();
  pool.fee = poolInfo.getFee();
  pool.save();
}

export function handleDeposit(event: Deposit): void {
  let stake = Stake.load(event.params.pid.toString().concat(event.params.tokenId.toString()));
  if (stake === null) {
    stake = new Stake(event.params.pid.toString().concat(event.params.tokenId.toString()));
  }
  stake.startStake = event.block.timestamp.toI32();
  let user = User.load(event.transaction.from.toHex());
  if (user === null) {
    user = new User(event.transaction.from.toHex());
    user.save();
  }
  stake.user = event.transaction.from.toHex();
  stake.poolPackage = event.params.pid.toString();
  stake.tokenId = event.params.tokenId;
  stake.save();
}

export function handleSetPool(event: SetPool): void {
  let pool = PoolPackage.load(event.params.pid.toString());
  if (pool === null) {
    pool = new PoolPackage(event.params.pid.toString());
  }
  pool.startTime = event.params.startTime.toI32();
  pool.endTime = event.params.endTime.toI32();
  pool.tokenPerSecond = event.params.tokenPerSecond;
  pool.save();
}

export function handleWithdraw(event: Withdraw): void {
  let stake = Stake.load(event.params.pid.toString().concat(event.params.tokenId.toString()));
  if (stake !== null) {
    stake.startStake = 0;
    stake.save();
  }
}

export function convertTokenToDecimal(tokenAmount: BigInt): BigDecimal {
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(BigInt.fromI32(18)));
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = BigInt.fromI32(0); i.lt(decimals as BigInt); i = i.plus(BigInt.fromI32(1))) {
    bd = bd.times(BigDecimal.fromString("10"));
  }

  return bd;
}
