export type Gender = "pria" | "wanita";
export type Tujuan = "naikkan" | "stabilkan" | "turunkan";

export function calcBMI(bb: number, tb: number) {
  const bmi = bb / (tb / 100) ** 2;
  return Math.round(bmi * 100) / 100;
}

export function bmiStatus(bmi: number) {
  if (bmi < 18.5) return "kurus";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obesitas";
}

export function calcBMR(bb: number, tb: number, usia: number, gender: Gender) {
  const base = 10 * bb + 6.25 * tb - 5 * usia;
  return Math.round(gender === "pria" ? base + 5 : base - 161);
}

export function calcTDEE(bmr: number) {
  return Math.round(bmr * 1.55);
}

export function calcTarget(tdee: number, tujuan: Tujuan) {
  if (tujuan === "naikkan") return tdee + 500;
  if (tujuan === "turunkan") return tdee - 500;
  return tdee;
}

export function calcAll(bb: number, tb: number, usia: number, gender: Gender, tujuan: Tujuan) {
  const bmi = calcBMI(bb, tb);
  return {
    bmi,
    status_bmi: bmiStatus(bmi),
    bmr: calcBMR(bb, tb, usia, gender),
    tdee: calcTDEE(calcBMR(bb, tb, usia, gender)),
    target_kalori: calcTarget(calcTDEE(calcBMR(bb, tb, usia, gender)), tujuan),
  };
}

export function isMemenuhi(total: number, target: number, tujuan: Tujuan) {
  if (tujuan === "turunkan") return total >= target * 0.85 && total <= target * 1.05;
  if (tujuan === "naikkan") return total >= target * 0.95;
  return total >= target * 0.9 && total <= target * 1.1;
}

export function calcStreak(days: { tanggal: string; total_kalori: number; target_kalori: number; tujuan: Tujuan }[]) {
  const sorted = [...days].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  let cursor = new Date(today);
  for (const d of sorted) {
    const expected = cursor.toISOString().slice(0, 10);
    if (d.tanggal !== expected) break;
    if (!isMemenuhi(d.total_kalori, d.target_kalori, d.tujuan)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
