import { useEffect } from "react";

export const useSubscribeEvmEvents = (
  callback: () => void,
  contract,
  active
) => {
  useEffect(() => {
    if (active) {
      contract.on("ApproveTransaction", () => {
        callback();
      });
      contract.on("DeleteTransaction", () => {
        callback();
      });

      contract.on("UnApproveTransaction", () => {
        callback();
      });

      contract.on("ExecuteTransaction", () => {
        callback();
      });
    }
  }, []);
};
