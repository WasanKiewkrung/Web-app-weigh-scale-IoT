export function useVersionValidation(version: string) {
  // ตรวจสอบเวอร์ชันแบบสมบูรณ์ (x.y.z)
  const isVersionComplete = (v: string) => /^\d+\.\d+\.\d+$/.test(v.trim())

  // ตรวจสอบเวอร์ชันแบบ partial ระหว่างพิมพ์ เช่น "1", "1.", "1.21", "1.21."
  const isVersionPartialValid = (v: string) => /^\d+(\.\d*){0,2}$/.test(v.trim())

  // เช็คว่าควรแสดงเตือนหรือไม่
  const showWarning =
    version.length >= 3 && !isVersionPartialValid(version) && !isVersionComplete(version)

  return { isVersionComplete: isVersionComplete(version), showWarning }
}
