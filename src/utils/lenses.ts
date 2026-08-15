export const formatearMedida = (val: any) => {
  if (val === null || val === undefined || val === "") return "0.00";
  const num = Number(val);
  if (isNaN(num)) return "0.00";
  const formatted = num.toFixed(2);
  return num > 0 ? `+${formatted}` : formatted;
};

export const formatearMedidasLente = (esf: any, cyl: any) => {
  return `${formatearMedida(esf)} / ${formatearMedida(cyl)}`;
};
