export async function getLogoBase64() {
  // อาจจะ cache base64 ไว้ด้วยก็ได้
  const res = await fetch('/logo/logo.jpg');
  const blob = await res.blob();
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // ตัด "data:image/jpeg;base64," ออก เหลือแค่ base64
      const base64 = (reader.result || '').toString().split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}