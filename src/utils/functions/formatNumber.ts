export function formatCurrencyVN(amount: number) {
  if (isNaN(amount)) {
    return '';
  }

  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
