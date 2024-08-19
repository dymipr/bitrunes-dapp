"use client";
import { useEffect, useState } from "react";
import { FeeEstimate } from "~/shared/lib/bitcoin/types";
import { BITCOIN_MEMPOOL_URL, BITCOIN_MEMPOOL_LIVE_URL } from "../constants/config";

export function useGasFees() {
  const [fees, setFees] = useState<FeeEstimate | undefined>();
  const getFees = async () => {
    try {
      const response = await fetch(`${BITCOIN_MEMPOOL_URL}/v1/fees/recommended`);
      const data = await response.json();
      setFees(data);
    } catch(e) {
      //Error on testnet
      const response = await fetch(`${BITCOIN_MEMPOOL_LIVE_URL}/v1/fees/recommended`);
      const data = await response.json();
      setFees(data);
    }
  };

  useEffect(() => {
    getFees();
  }, []);

  return { fees, getFees };
}
