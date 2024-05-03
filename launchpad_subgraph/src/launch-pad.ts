import { BigInt } from "@graphprotocol/graph-ts"
import {
  LaunchPad,
  ClaimGiveBack,
  ClaimToken,
  Commit,
  CancelCommit,
  Refund,
  ApplyWhiteList,
} from "../generated/LaunchPad/LaunchPad"
import { TransactionHistory, User, UserCommit } from "../generated/schema"

export function handleApplyWhiteList(event: ApplyWhiteList): void {
  let user = User.load(event.transaction.from.toHex());
  if (user === null) {
    user = new User(event.transaction.from.toHex());
    user.projects = []
    user.save();
  }
  let lpContractBind = LaunchPad.bind(event.address).try_launchpadContract()
  let lpContract = ''
  if (lpContractBind.reverted) {
    lpContract = LaunchPad.bind(event.address).launchPadContract().toHex()
  } else {
    lpContract = lpContractBind.value.toHex()
  }
  if (user.projects.length != 0) {
    let isDouble = false;
    for (let i = 0; i < user.projects.length; i++) {
      
      if (user.projects[i] == lpContract) {
        isDouble = true;
      }
    }
    if (isDouble == false) {
      let projects = user.projects;
      projects.push(lpContract)
      user.projects = projects;
    }
  } else {
    let projects = user.projects;
    projects.push(lpContract)
    user.projects = projects;
  }
  user.save();
}

export function handleCancel(event: CancelCommit): void {
  let user = User.load(event.transaction.from.toHex());
  if (user === null) {
    user = new User(event.transaction.from.toHex());
    user.projects = []
    user.save();
  }

  let history = TransactionHistory.load(event.transaction.hash.toHex() + "CANCEL");
  if (history === null) {
    history = new TransactionHistory(event.transaction.hash.toHex() + "CANCEL");
    history.roundAddress = event.address.toHex();
    history.launchpadAddress = event.params.launchPadContract.toHex()
    history.transactionType = "CANCEL";
    history.processTime = event.block.timestamp.toI32();
    history.u2uAmount = event.params.amount;
    history.tokenAmount = BigInt.fromI32(0);
    history.roundType = LaunchPad.bind(event.address).roundType();
    history.user = event.transaction.from.toHex();
    history.hash = event.transaction.hash.toHex();
    history.save();
  }
  let commitId = event.transaction.from.toHex() + event.address.toHex()
  let commit = UserCommit.load(commitId)
  if (commit === null) {
    commit = new UserCommit(commitId)
    commit.user = event.transaction.from.toHex()
    commit.u2uAmount = BigInt.fromI32(0)
    commit.roundAddress = event.address.toHex()
    commit.launchpadAddress = event.params.launchPadContract.toHex()
    commit.roundType = LaunchPad.bind(event.address).roundType();
    commit.startCancel = LaunchPad.bind(event.address).startCancel().toI32()
    commit.endCancel = LaunchPad.bind(event.address).endCancel().toI32()
    commit.isClaimed = false
    commit.processTime = event.block.timestamp.toI32();
  }
  commit.processTime = event.block.timestamp.toI32();
  commit.u2uAmount = BigInt.fromI32(0)
  commit.save()
}

export function handleClaimGiveBack(event: ClaimGiveBack): void {
  let user = User.load(event.transaction.from.toHex());
  if (user === null) {
    user = new User(event.transaction.from.toHex());
    user.projects = [];
    user.save();
  }
  let history = TransactionHistory.load(event.transaction.hash.toHex() + "GIVEBACK");
  if (history === null) {
    history = new TransactionHistory(event.transaction.hash.toHex() + "GIVEBACK");
    history.roundAddress = "";
    history.launchpadAddress = event.params.launchPadContract.toHex();
    history.transactionType = "GIVE_BACK";
    history.processTime = event.block.timestamp.toI32();
    history.u2uAmount = event.params.amount;
    history.tokenAmount = BigInt.fromI32(0);
    history.roundType = LaunchPad.bind(event.address).roundType();
    history.user = event.params.committer.toHex();
    history.hash = event.transaction.hash.toHex();
    history.save();
  }
  let commitId = event.transaction.from.toHex() + event.address.toHex()
  let commit = UserCommit.load(commitId)
  if (commit === null) {
    commit = new UserCommit(commitId)
    commit.user = event.transaction.from.toHex()
    commit.u2uAmount = BigInt.fromI32(0)
    commit.roundAddress = event.address.toHex()
    commit.launchpadAddress = event.params.launchPadContract.toHex()
    commit.roundType = LaunchPad.bind(event.address).roundType();
    commit.startCancel = LaunchPad.bind(event.address).startCancel().toI32()
    commit.endCancel = LaunchPad.bind(event.address).endCancel().toI32()
    commit.isClaimed = false
    commit.processTime = event.block.timestamp.toI32();
  }
  commit.u2uAmount = commit.u2uAmount.minus(event.params.amount);
  commit.save()
}

export function handleClaimToken(event: ClaimToken): void {
  let user = User.load(event.transaction.from.toHex());
  if (user === null) {
    user = new User(event.transaction.from.toHex());
    user.projects = [];
    user.save();
  }
  // user.commits.;
  let history = TransactionHistory.load(event.transaction.hash.toHex() + "CLAIMTOKEN");
  if (history === null) {
    history = new TransactionHistory(event.transaction.hash.toHex() + "CLAIMTOKEN");
    history.roundAddress = event.address.toHex();
    history.launchpadAddress = event.address.toHex()
    history.transactionType = "CLAIM_TOKEN";
    history.processTime = event.block.timestamp.toI32();
    history.u2uAmount = BigInt.fromI64(0);
    history.tokenAmount = event.params.tokenAmount;
    history.roundType = "";
    history.user = event.transaction.from.toHex();
    history.hash = event.transaction.hash.toHex();
    history.save();
  }
  let rounds = LaunchPad.bind(event.address).viewRounds()
  for (let i = 0; i < rounds.length; i++) {
    let commitId = event.transaction.from.toHex() + rounds[i].toHex()
    let commit = UserCommit.load(commitId)
    if (commit != null && commit.u2uAmount != BigInt.fromI32(0)) {
      commit.isClaimed = true;
      commit.save();
    }
  }
}

export function handleCommit(event: Commit): void {
  let user = User.load(event.transaction.from.toHex());
  if (user === null) {
    user = new User(event.transaction.from.toHex());
    user.projects = [];
  }
  if (user.projects.length != 0) {
    let isDouble = false;
    for (let i = 0; i < user.projects.length; i++) {
      if (user.projects[i] == event.params.launchPadContract.toHex()) {
        isDouble = true;
      }
    }
    if (isDouble == false) {
      let projects = user.projects;
      projects.push(event.params.launchPadContract.toHex())
      user.projects = projects;
    }
  } else {
    let projects = user.projects;
    projects.push(event.params.launchPadContract.toHex())
    user.projects = projects;
  }
  user.save();

  let history = TransactionHistory.load(event.transaction.hash.toHex() + "COMMIT");
  if (history === null) {
    history = new TransactionHistory(event.transaction.hash.toHex() + "COMMIT");
    history.roundAddress = event.address.toHex();
    history.launchpadAddress = event.params.launchPadContract.toHex()
    history.transactionType = "COMMIT";
    history.processTime = event.block.timestamp.toI32();
    history.u2uAmount = event.params.amount;
    history.tokenAmount = BigInt.fromI32(0);
    history.roundType = LaunchPad.bind(event.address).roundType();
    history.user = event.transaction.from.toHex();
    history.hash = event.transaction.hash.toHex();
    history.save();
  }
  let commitId = event.transaction.from.toHex() + event.address.toHex()
  let commit = UserCommit.load(commitId)
  if (commit === null) {
    commit = new UserCommit(commitId)
    commit.user = event.transaction.from.toHex()
    commit.u2uAmount = BigInt.fromI32(0)
    commit.roundAddress = event.address.toHex()
    commit.launchpadAddress = event.params.launchPadContract.toHex()
    commit.roundType = LaunchPad.bind(event.address).roundType();
    commit.startCancel = LaunchPad.bind(event.address).startCancel().toI32()
    commit.endCancel = LaunchPad.bind(event.address).endCancel().toI32()
    commit.isClaimed = false
    commit.processTime = event.block.timestamp.toI32();
  }
  commit.launchpadAddress = event.params.launchPadContract.toHex()
  commit.u2uAmount = commit.u2uAmount.plus(event.params.amount);
  commit.save()
}

export function handleRefund(event: Refund): void {
  let user = User.load(event.transaction.from.toHex());
  if (user === null) {
    user = new User(event.transaction.from.toHex());
    user.projects = []
    user.save();
  }
  let history = TransactionHistory.load(event.transaction.hash.toHex() + "REFUND");
  if (history === null) {
    history = new TransactionHistory(event.transaction.hash.toHex() + "REFUND");
    history.roundAddress = "";
    history.launchpadAddress = event.address.toHex();
    history.transactionType = "REFUND";
    history.processTime = event.block.timestamp.toI32();
    history.u2uAmount = event.params.amount;
    history.tokenAmount = BigInt.fromI32(0);
    history.roundType = "";
    history.user = event.transaction.from.toHex();
    history.hash = event.transaction.hash.toHex();
    history.save();
  }
  let rounds = LaunchPad.bind(event.address).viewRounds()
  for (let i = 0; i < rounds.length; i++) {
    let commitId = event.transaction.from.toHex() + rounds[i].toHex()
    let commit = UserCommit.load(commitId)
    if (commit != null && commit.u2uAmount != BigInt.fromI32(0)) {
      commit.isClaimed = true;
      commit.save();
    }
  }
}

