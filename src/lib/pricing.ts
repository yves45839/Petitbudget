const roundUpToNextThousand = (amount: number) => Math.ceil(amount / 1000) * 1000;

export type DisplayPrices = {
  displayPrice: number;
  originalPrice: number;
};

export const getDisplayPrices = (basePrice: number): DisplayPrices => {
  const shouldIncreaseDisplayedPrice = basePrice > 5000 && basePrice < 100000;
  const adjustedDisplayBase = shouldIncreaseDisplayedPrice ? basePrice * 1.2 : basePrice;
  const displayPrice = roundUpToNextThousand(adjustedDisplayBase);
  const originalPrice = roundUpToNextThousand(displayPrice * 1.3);

  return { displayPrice, originalPrice };
};
