import * as React from 'react';
import {
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Document,
  Font,
} from '@react-pdf/renderer';
import type { Receipt } from '@/types/receipt';  

// Font Register
Font.register({
  family: 'Sarabun',
  fonts: [
    {
      src: '/font/Sarabun-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: '/font/Sarabun-Bold.ttf',
      fontWeight: 'bold',
    },
  ],
});

// ✅ Styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 25,
    paddingBottom: 30,
    paddingHorizontal: 20,
    fontFamily: 'Sarabun',
    color: '#000',
  },
  logo: {
    height: 120,
    marginBottom: 10,
    alignSelf: 'center',
  },
  headerRight: {
    textAlign: 'right',
    marginTop: -10,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  rowHeader: {
    flexDirection: 'row',
    borderBottom: '1pt solid #ccc',
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1pt solid #ccc',
    padding: 5,
  },
  cell: {
    flex: 1,
    padding: 2,
  },
  cellRight: {
    flex: 1,
    textAlign: 'right',
    padding: 2,
  },
  summary: {
    marginTop: 20,
    textAlign: 'right',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default function ReceiptPDF({
  receipt,
  logoBase64,
}: {
  receipt: Receipt;
  logoBase64: string;
}) {
  const thaiDate = new Date(receipt.createdAt || Date.now()).toLocaleDateString('th-TH');
  const logoUrl = `data:image/jpeg;base64,${logoBase64}`;
  console.log('Logo URL:', logoUrl);

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ✅ Logo Centered */}
        <Image src="/logo/logo.jpg" style={styles.logo} />
        
        {/* ✅ Header Title and Info */}
        <View style={styles.headerRight}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0e7490', marginBottom: 4 }}>
            ใบเสร็จรับเงิน
          </Text>
          <Text style={{ fontSize: 12 }}>เลขที่: {receipt.receiptNo}</Text>
          <Text style={{ fontSize: 12 }}>วันที่: {thaiDate}</Text>
        </View>

        {/* ✅ Seller & Customer Info */}
        <View style={styles.section}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>ผู้ขาย:</Text>
          <Text style={{ fontSize: 12 }}>{receipt.sellerName}</Text>
          <Text style={{ fontSize: 12 }}>{receipt.sellerDetail}</Text>

          <Text style={{ fontSize: 12, fontWeight: 'bold', marginTop: 10 }}>ลูกค้า:</Text>
          <Text style={{ fontSize: 12 }}>{receipt.customerName}</Text>
          <Text style={{ fontSize: 12 }}>{receipt.customerAddress}</Text>
        </View>

        {/* ✅ Table Header */}
        <View style={styles.rowHeader}>
          <Text style={{ flex: 0.5, fontSize: 12 }}>#</Text>
          <Text style={{ flex: 2.5, fontSize: 12 }}>รายการ</Text>
          <Text style={{ flex: 1.2, fontSize: 12, textAlign: 'right' }}>จำนวนน</Text>
          <Text style={{ flex: 1.2, fontSize: 12, textAlign: 'right' }}>ราคา/หน่วย</Text>
          <Text style={{ flex: 1.2, fontSize: 12, textAlign: 'right' }}>รวม</Text>
        </View>

        {/* ✅ Table Rows */}
        {receipt.items.map((item, index) => (
          <View style={styles.row} key={index}>
            <Text style={{ flex: 0.5, fontSize: 12 }}>{index + 1}</Text>
            <Text style={{ flex: 2.5, fontSize: 12 }}>{item.description}</Text>
            <Text style={{ flex: 1.2, fontSize: 12, textAlign: 'right' }}>{item.qty}</Text>
            <Text style={{ flex: 1.2, fontSize: 12, textAlign: 'right' }}>
              {item.price.toFixed(2)}
            </Text>
            <Text style={{ flex: 1.2, fontSize: 12, textAlign: 'right' }}>
              {item.total.toFixed(2)}
            </Text>
          </View>
        ))}

        {/* ✅ Shipping Row */}
        <View style={styles.row}>
          <Text style={{ flex: 0.5, fontSize: 12 }}>{receipt.items.length + 1}</Text>
          <Text style={{ flex: 2.5, fontSize: 12 }}>{receipt.shippingMethod}</Text>
          <Text style={{ flex: 1.2, fontSize: 12, textAlign: 'right' }}>1</Text>
          <Text style={{ flex: 1.2, fontSize: 12, textAlign: 'right' }}>
            {receipt.shippingCost.toFixed(2)}
          </Text>
          <Text style={{ flex: 1.2, fontSize: 12, textAlign: 'right' }}>
            {receipt.shippingCost.toFixed(2)}
          </Text>
        </View>

        {/* ✅ Summary */}
        <View style={styles.summary}>
          <Text style={{ fontSize: 14 }}>จำนวนเงินรวมทั้งสิ้นน</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            {receipt.totalAll.toLocaleString('th-TH', {
              minimumFractionDigits: 2,
            })} บาท
          </Text>
        </View>

        {/* ✅ Spacer เพื่อดันลงล่าง */}
        <View style={{ flexGrow: 1 }} />

        {/* ✅ Footer Signature Section */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 8, // ✅ เว้นห่างจากขอบล่างเล็กน้อย
          }}
          fixed
        >
          {/* 👤 ฝั่งลูกค้า */}
          <View style={{ width: '45%', textAlign: 'center' }}>
            <Text style={{ fontSize: 10, marginBottom: 30 }}>ในนาม {receipt.customerName}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
                <View style={{ borderTop: '1pt solid #888', width: 100, marginBottom: 4 }} />
                <Text style={{ fontSize: 10 }}>ผู้ชำระเงินน</Text>
              </View>
              <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
                <View style={{ borderTop: '1pt solid #888', width: 100, marginBottom: 4 }} />
                <Text style={{ fontSize: 10 }}>วันที่</Text>
              </View>
            </View>
          </View>

          {/* 🧾 ฝั่งผู้ขาย */}
          <View style={{ width: '45%', textAlign: 'center' }}>
            <Text style={{ fontSize: 10, marginBottom: 30 }}>ในนาม Backyard Bangkok</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
                <View style={{ borderTop: '1pt solid #888', width: 100, marginBottom: 4 }} />
                <Text style={{ fontSize: 10 }}>ผู้รับเงิน</Text>
              </View>
              <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
                <View style={{ borderTop: '1pt solid #888', width: 100, marginBottom: 4 }} />
                <Text style={{ fontSize: 10 }}>วันที่</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

