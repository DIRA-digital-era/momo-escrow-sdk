var TransactionStatus = /* @__PURE__ */ ((TransactionStatus2) => {
  TransactionStatus2["PENDING"] = "pending";
  TransactionStatus2["COLLECTION_INITIATED"] = "collection_initiated";
  TransactionStatus2["COLLECTED"] = "collected";
  TransactionStatus2["COLLECTION_FAILED"] = "collection_failed";
  TransactionStatus2["DISBURSEMENT_INITIATED"] = "disbursement_initiated";
  TransactionStatus2["DISBURSED"] = "disbursed";
  TransactionStatus2["DISBURSEMENT_FAILED"] = "disbursement_failed";
  TransactionStatus2["REFUNDED"] = "refunded";
  return TransactionStatus2;
})(TransactionStatus || {});
export {
  TransactionStatus
};
