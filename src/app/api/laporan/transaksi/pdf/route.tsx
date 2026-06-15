import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, renderToStream } from '@react-pdf/renderer';
import { getLaporanData } from '@/app/(pengelola)/laporan/transaksi/actions';
import { formatRupiah } from '@/lib/format';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Styles for the PDF Document
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1e293b',
  },
  headerContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    paddingBottom: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  headerText: {
    flexDirection: 'column',
    flex: 1,
  },
  titleKab: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#0f172a',
  },
  titleObj: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#0f172a',
    marginTop: 2,
  },
  titleSub: {
    fontSize: 9,
    color: '#475569',
    marginTop: 2,
  },
  docTitleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#0f172a',
  },
  docPeriod: {
    fontSize: 10,
    marginTop: 4,
    color: '#334155',
    fontWeight: 'bold',
  },
  tablesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tableWrapper: {
    width: '48%',
  },
  tableTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
  },
  titleMasuk: {
    color: '#16a34a',
    borderBottomColor: '#16a34a',
  },
  titleKeluar: {
    color: '#dc2626',
    borderBottomColor: '#dc2626',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 5,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  colName: {
    flex: 1,
  },
  colAmount: {
    width: 90,
    textAlign: 'right',
  },
  colHeaderName: {
    flex: 1,
    fontWeight: 'bold',
  },
  colHeaderAmount: {
    width: 90,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  noDataRow: {
    padding: 8,
    textAlign: 'center',
    color: '#64748b',
    fontStyle: 'italic',
  },
  // Ringkasan Saldo Table
  saldoWrapper: {
    marginTop: 10,
    marginBottom: 24,
  },
  saldoTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
    color: '#0f172a',
  },
  saldoHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 6,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  saldoRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  saldoRowTotal: {
    flexDirection: 'row',
    padding: 6,
    backgroundColor: '#f8fafc',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
  },
  saldoTextBold: {
    fontWeight: 'bold',
  },
  saldoAmountSuccess: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
  saldoAmountDanger: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  // Signatures
  footerSign: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signContainer: {
    width: 220,
    alignItems: 'center',
  },
  signDate: {
    fontSize: 9,
    marginBottom: 2,
  },
  signRole: {
    fontWeight: 'bold',
    fontSize: 9,
    marginBottom: 48,
  },
  signNameLine: {
    width: 160,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    height: 1,
  },
  signNameSub: {
    fontSize: 8,
    color: '#475569',
    marginTop: 4,
  }
});

// PDF Document Component
const PDFDocument = ({ data, logoPath, hasLogo }: { data: any, logoPath: string, hasLogo: boolean }) => {
  const NAMA_BULAN = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const now = new Date();
  const tanggalHariIni = `${now.getDate()} ${NAMA_BULAN[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Kop Surat / Header */}
        <View style={styles.headerContainer}>
          {hasLogo && <Image src={logoPath} style={styles.logo} />}
          <View style={styles.headerText}>
            <Text style={styles.titleKab}>Pemerintah Kabupaten Kebumen</Text>
            <Text style={styles.titleObj}>Pengelola Obyek Wisata Pantai Mliwis</Text>
            <Text style={styles.titleSub}>Kecamatan Ambal, Kabupaten Kebumen, Jawa Tengah</Text>
          </View>
        </View>

        {/* Judul Dokumen */}
        <View style={styles.docTitleContainer}>
          <Text style={styles.docTitle}>Laporan Transaksi & Keuangan</Text>
          <Text style={styles.docPeriod}>Periode: {data.period}</Text>
        </View>

        {/* Rincian Pemasukan & Pengeluaran Side-by-Side */}
        <View style={styles.tablesRow}>
          {/* Rincian Pemasukan */}
          <View style={styles.tableWrapper}>
            <Text style={[styles.tableTitle, styles.titleMasuk]}>Rincian Pemasukan</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.colHeaderName}>Jenis Transaksi</Text>
              <Text style={styles.colHeaderAmount}>Jumlah</Text>
            </View>
            {data.kasMasuk.grouped.map((g: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.colName}>{g.jenis}</Text>
                <Text style={styles.colAmount}>{formatRupiah(g.total)}</Text>
              </View>
            ))}
            {data.kasMasuk.grouped.length === 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.noDataRow}>Tidak ada data</Text>
              </View>
            )}
          </View>

          {/* Rincian Pengeluaran */}
          <View style={styles.tableWrapper}>
            <Text style={[styles.tableTitle, styles.titleKeluar]}>Rincian Pengeluaran</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.colHeaderName}>Jenis Transaksi</Text>
              <Text style={styles.colHeaderAmount}>Jumlah</Text>
            </View>
            {data.kasKeluar.grouped.map((g: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.colName}>{g.jenis}</Text>
                <Text style={styles.colAmount}>{formatRupiah(g.total)}</Text>
              </View>
            ))}
            {data.kasKeluar.grouped.length === 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.noDataRow}>Tidak ada data</Text>
              </View>
            )}
          </View>
        </View>

        {/* Tabel Ringkasan Saldo (Saldo: total pemasukan, total pengeluaran, saldo bersih) */}
        <View style={styles.saldoWrapper}>
          <Text style={styles.saldoTitle}>Ringkasan Saldo</Text>
          <View style={styles.saldoHeader}>
            <Text style={styles.colHeaderName}>Keterangan</Text>
            <Text style={styles.colHeaderAmount}>Jumlah</Text>
          </View>
          <View style={styles.saldoRow}>
            <Text style={styles.colName}>Total Pemasukan</Text>
            <Text style={[styles.colAmount, styles.saldoAmountSuccess]}>{formatRupiah(data.kasMasuk.total)}</Text>
          </View>
          <View style={styles.saldoRow}>
            <Text style={styles.colName}>Total Pengeluaran</Text>
            <Text style={[styles.colAmount, styles.saldoAmountDanger]}>{formatRupiah(data.kasKeluar.total)}</Text>
          </View>
          <View style={styles.saldoRowTotal}>
            <Text style={[styles.colName, styles.saldoTextBold]}>Saldo Bersih</Text>
            <Text style={[
              styles.colAmount,
              data.saldo >= 0 ? styles.saldoAmountSuccess : styles.saldoAmountDanger
            ]}>
              {formatRupiah(data.saldo)}
            </Text>
          </View>
        </View>

        {/* Tanda Tangan */}
        <View style={styles.footerSign}>
          <View style={styles.signContainer}>
            <Text style={styles.signDate}>Kebumen, {tanggalHariIni}</Text>
            <Text style={styles.signRole}>Pengelola Pantai Mliwis</Text>
            <View style={styles.signNameLine} />
            <Text style={styles.signNameSub}>Staf Administrasi</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') || 'bulanan') as 'harian' | 'mingguan' | 'bulanan';
    const month = searchParams.get('month') ? Number(searchParams.get('month')) : undefined;
    const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined;
    const week = searchParams.get('week') ? Number(searchParams.get('week')) : undefined;
    const day = searchParams.get('day') ? Number(searchParams.get('day')) : undefined;

    const data = await getLaporanData(type, month, year, week, day);
    
    if ('error' in data) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    const logoPath = path.join(process.cwd(), 'public', 'logo_mliwis.jpg');
    const hasLogo = fs.existsSync(logoPath);

    // Generate PDF Stream
    const nodeStream = await renderToStream(
      <PDFDocument data={data} logoPath={logoPath} hasLogo={hasLogo} />
    );

    // Convert Node.js stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      }
    });

    const periodSlug = data.period.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `Laporan-Transaksi-${periodSlug}.pdf`;

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Gagal men-generate PDF:", error);
    return NextResponse.json({ error: "Gagal memproses file PDF." }, { status: 500 });
  }
}
