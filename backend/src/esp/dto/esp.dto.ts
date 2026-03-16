export class EspDto {
  date: string;           // 📅 วันที่ชั่ง 
  time: string;           // 🕒 เวลาชั่ง 
  meatType: number;       // 🥩 รหัสเนื้อ (จาก Keypad)
  weight: number;         // ⚖️ น้ำหนัก 
  orderId?: string;       // 🧾 รหัสออเดอร์ (optional จาก ESP32)
}
