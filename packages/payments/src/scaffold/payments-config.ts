import genesisConfig from "../genesis.config";

export function getPaymentsCurrency(): string {
  const payments = genesisConfig.modules.find((m) => m.id === "payments");
  const currency = (payments?.options as { currency?: string } | undefined)?.currency;
  return currency ?? "NGN";
}
