import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  title: { fontSize: 18, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }
});

export function InvoicePdf({
  invoiceNumber,
  sellerName,
  total,
  paid,
  balance
}: { invoiceNumber: string; sellerName: string; total: number; paid: number; balance: number }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Factura {invoiceNumber}</Text>
        <Text>Vendedora: {sellerName}</Text>
        <View style={styles.row}><Text>Total COP</Text><Text>{total.toFixed(2)}</Text></View>
        <View style={styles.row}><Text>Pagado COP</Text><Text>{paid.toFixed(2)}</Text></View>
        <View style={styles.row}><Text>Saldo COP</Text><Text>{balance.toFixed(2)}</Text></View>
      </Page>
    </Document>
  );
}
