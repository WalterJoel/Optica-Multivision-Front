export const formatearMedida = (val: any) => {
  if (!val) return "0";
  const num = Number(val);
  return num > 0 ? `+${val}` : String(val);
};

export const formatearMedidasLente = (esf: any, cyl: any) => {
  return `${formatearMedida(esf)} | ${formatearMedida(cyl)}`;
};
