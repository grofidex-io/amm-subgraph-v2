import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import {
  TreasuryBorrow,
  Approval,
  ApprovalForAll,
  Borrow,
  ConfigPackage,
  Initialized,
  PayOff,
  ReturnStakingNFT,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer,
  Withdraw,
} from "../generated/TreasuryBorrow/TreasuryBorrow";
import { Staking } from "../generated/TreasuryBorrow/Staking";
import { Loan, LoanHistory, LoanPackage, User } from "../generated/schema";

export function handleApproval(event: Approval): void {}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleBorrow(event: Borrow): void {
  let loan = Loan.load(event.params.tokenId.toString());
  if (loan === null) {
    loan = new Loan(event.params.tokenId.toString());
  }
  loan.borrowAmount = event.params.amount;
  loan.borrowTime = event.block.timestamp.toI32();
  let packageLoan = LoanPackage.load(event.params.packageId.toString());
  let user0 = User.load("0x0000000000000000000000000000000000000000");
  if (user0 === null) {
    user0 = new User("0x0000000000000000000000000000000000000000");
    user0.save();
  }
  let user = User.load(event.transaction.from.toHex());
  if (user === null) {
    user = new User(event.transaction.from.toHex());
    user.save();
  }

  if (packageLoan != null) {
    loan.repayTime = event.block.timestamp.toI32() + packageLoan.period;
    loan.loanPackage = packageLoan.id;
    loan.repayAmount = event.params.amount.plus(event.params.amount.times(packageLoan.annualRateOrigin).div(BigInt.fromString('100000000000000000000')))
  }
  let contract = TreasuryBorrow.bind(event.address)

  let staking = contract.try_stakingManager()
  if(!staking.reverted) {
    let stakingContract = Staking.bind(staking.value)
    let getURIInfo = stakingContract.try_uriInfoById(event.params.stakeId)
    if(!getURIInfo.reverted) {
      loan.stakeAmount = getURIInfo.value.getAmount()
    }
  }
  loan.stakeId = event.params.stakeId;
  loan.user = event.transaction.from.toHex();
  loan.payOffTime = 0;
  loan.save();
  let history = LoanHistory.load(event.params.tokenId.toString().concat("BORROW"))
  if (history == null) {
    history = new LoanHistory(event.params.tokenId.toString().concat("BORROW"))
  }
  history.borrowAmount = event.params.amount;
  history.borrowTime = event.block.timestamp.toI32();
  history.repayAmount = loan.repayAmount;
  history.repayTime = loan.repayTime;
  history.loanId = event.params.tokenId;
  history.type = "BORROW";
  history.processTime = event.block.timestamp.toI32();
  history.txn = event.transaction.hash.toHex();
  history.stakeAmount = loan.stakeAmount;
  history.user = event.transaction.from.toHex();
  history.rewardUser = BigInt.fromI32(0);
  history.stakeId = loan.stakeId;
  history.save()
}

export function handleConfigPackage(event: ConfigPackage): void {
  let packageLoan = LoanPackage.load(event.params.packageId.toString());
  if (packageLoan === null) {
    packageLoan = new LoanPackage(event.params.packageId.toString());
  }
  packageLoan.period = event.params.period.toI32();
  packageLoan.annualRate = convertTokenToDecimal(event.params.annualRate);
  packageLoan.maxBorrowRatio = convertTokenToDecimal(event.params.maxBorrowRatio);
  packageLoan.minBorrow = event.params.minBorrow;
  packageLoan.annualRateOrigin = event.params.annualRate;
  if (event.params.period.toI32() >= 86400) {
    let time = event.params.period.div(BigInt.fromI32(86400));
    packageLoan.symbolTime = time.toString() + " days";
  } else if (event.params.period.toI32() >= 3600) {
    let time = event.params.period.div(BigInt.fromI32(3600));
    packageLoan.symbolTime = time.toString() + " hours";
  } else {
    let time = event.params.period.div(BigInt.fromI32(60));
    packageLoan.symbolTime = time.toString() + " minutes";
  }

  packageLoan.save();
}

export function handlePayOff(event: PayOff): void {
  let loan = Loan.load(event.params.tokenId.toString());
  if (loan === null) {
    loan = new Loan(event.params.tokenId.toString());
  }
  loan.payOffTime = event.block.timestamp.toI32();
  loan.save();
  let history = LoanHistory.load(event.params.tokenId.toString().concat("LIQUIDATION"))
  if (history == null) {
    history = new LoanHistory(event.params.tokenId.toString().concat("LIQUIDATION"))
  }
  history.borrowAmount = loan.borrowAmount;
  history.borrowTime = loan.borrowTime;
  history.repayAmount = loan.repayAmount;
  history.repayTime = loan.repayTime;
  history.loanId = event.params.tokenId;
  history.type = "LIQUIDATION";
  history.processTime = event.block.timestamp.toI32();
  history.txn = event.transaction.hash.toHex();
  history.stakeAmount = loan.stakeAmount;
  history.user = loan.user;
  history.rewardUser = event.params.rewardUser;
  history.stakeId = loan.stakeId;
  history.save()
}

export function handleReturnStakingNFT(event: ReturnStakingNFT): void {
  let loan = Loan.load(event.params.tokenId.toString());
  if (loan === null) {
    loan = new Loan(event.params.tokenId.toString());
  }
  let user0 = User.load("0x0000000000000000000000000000000000000000");
  if (user0 === null) {
    user0 = new User("0x0000000000000000000000000000000000000000");
    user0.save();
  }
  loan.user = "0x0000000000000000000000000000000000000000";
  loan.save();
  let history = LoanHistory.load(event.params.tokenId.toString().concat("REPAY"))
  if (history == null) {
    history = new LoanHistory(event.params.tokenId.toString().concat("REPAY"))
  }
  history.borrowAmount = loan.borrowAmount;
  history.borrowTime = loan.borrowTime;
  history.repayAmount = loan.repayAmount;
  history.repayTime = loan.repayTime;
  history.processTime = event.block.timestamp.toI32();
  history.txn = event.transaction.hash.toHex();
  history.loanId = event.params.tokenId;
  history.type = "REPAY";
  history.stakeAmount = loan.stakeAmount;
  history.user = event.transaction.from.toHex();
  history.rewardUser = BigInt.fromI32(0);
  history.stakeId = loan.stakeId;
  history.save()
}

// export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

// export function handleRoleGranted(event: RoleGranted): void {}

// export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleTransfer(event: Transfer): void {
  let loan = Loan.load(event.params.tokenId.toString());
  if (loan != null && loan.user != "0x0000000000000000000000000000000000000000") {
    let user = User.load(event.params.to.toHex());
    if (user === null) {
      user = new User(event.params.to.toHex());
      user.save();
    }
    loan = new Loan(event.params.tokenId.toString());
    loan.user = event.params.to.toHex();
    loan.save();
  }
}

export function handleWithdraw(event: Withdraw): void {
  let loan = Loan.load(event.params.tokenId.toString());
  if (loan === null) {
    loan = new Loan(event.params.tokenId.toString());
  }
  let user0 = User.load("0x0000000000000000000000000000000000000000");
  if (user0 === null) {
    user0 = new User("0x0000000000000000000000000000000000000000");
    user0.save();
  }
  loan.user = "0x0000000000000000000000000000000000000000";
  loan.save();
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
