import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, renderToStream } from '@react-pdf/renderer';
import { getPengunjung } from '@/app/(pengelola)/laporan/pengunjung/actions';
import { formatTanggal } from '@/lib/format';
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
    marginBottom: 20,
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
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f2556',
  },
  statLabel: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  // Table
  table: {
    width: '100%',
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    fontWeight: 'bold',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 5,
  },
  colNo: { width: 30, textAlign: 'center' },
  colTanggal: { flex: 2 },
  colHari: { flex: 1.2 },
  colBalita: { flex: 1.5, textAlign: 'right' },
  colAnak: { flex: 1.5, textAlign: 'right' },
  colDewasa: { flex: 1.5, textAlign: 'right' },
  colTotal: { flex: 1.8, textAlign: 'right', fontWeight: 'bold' },
  
  colHeaderNo: { width: 30, textAlign: 'center', fontWeight: 'bold' },
  colHeaderTanggal: { flex: 2, fontWeight: 'bold' },
  colHeaderHari: { flex: 1.2, fontWeight: 'bold' },
  colHeaderBalita: { flex: 1.5, textAlign: 'right', fontWeight: 'bold' },
  colHeaderAnak: { flex: 1.5, textAlign: 'right', fontWeight: 'bold' },
  colHeaderText: { flex: 1.5, textAlign: 'right', fontWeight: 'bold' },
  colHeaderTotal: { flex: 1.8, textAlign: 'right', fontWeight: 'bold' },

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
  const BULAN = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const now = new Date();
  const tanggalHariIni = `${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`;
  const periodText = `${BULAN[data.month - 1]} ${data.year}`;

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
          <Text style={styles.docTitle}>Laporan Jumlah Pengunjung Harian</Text>
          <Text style={styles.docPeriod}>Periode: {periodText}</Text>
        </View>

        {/* 5-Column Stats Box */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.total.toLocaleString('id-ID')}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.totalBalita.toLocaleString('id-ID')}</Text>
            <Text style={styles.statLabel}>Balita</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.totalAnak.toLocaleString('id-ID')}</Text>
            <Text style={styles.statLabel}>Anak-anak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.totalDewasa.toLocaleString('id-ID')}</Text>
            <Text style={styles.statLabel}>Dewasa</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.rataRata.toLocaleString('id-ID')}</Text>
            <Text style={styles.statLabel}>Rata-rata</Text>
          </View>
        </View>

        {/* Tabel Data Pengunjung */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colHeaderNo}>No</Text>
            <Text style={styles.colHeaderTanggal}>Tanggal</Text>
            <Text style={styles.colHeaderHari}>Hari</Text>
            <Text style={styles.colHeaderBalita}>Balita</Text>
            <Text style={styles.colHeaderAnak}>Anak</Text>
            <Text style={styles.colHeaderText}>Dewasa</Text>
            <Text style={styles.colHeaderTotal}>Total</Text>
          </View>
          {data.data.map((p: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colNo}>{index + 1}</Text>
              <Text style={styles.colTanggal}>{formatTanggal(p.tanggal)}</Text>
              <Text style={styles.colHari}>{HARI[new Date(p.tanggal).getDay()]}</Text>
              <Text style={styles.colBalita}>{p.jumlahBalita.toLocaleString('id-ID')}</Text>
              <Text style={styles.colAnak}>{p.jumlahAnak.toLocaleString('id-ID')}</Text>
              <Text style={styles.colDewasa}>{p.jumlahDewasa.toLocaleString('id-ID')}</Text>
              <Text style={styles.colTotal}>{p.jumlah.toLocaleString('id-ID')}</Text>
            </View>
          ))}
          {data.data.length === 0 && (
            <View style={styles.tableRow}>
              <Text style={{ flex: 1, textAlign: 'center', color: '#64748b', fontStyle: 'italic', padding: 8 }}>
                Belum ada data pengunjung pada periode ini.
              </Text>
            </View>
          )}
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
    const month = searchParams.get('month') ? Number(searchParams.get('month')) : undefined;
    const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined;

    const data = await getPengunjung(month, year);
    
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

    const periodSlug = `${data.month}-${data.year}`;
    const filename = `Laporan-Pengunjung-${periodSlug}.pdf`;

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Gagal men-generate PDF pengunjung:", error);
    return NextResponse.json({ error: "Gagal memproses file PDF pengunjung." }, { status: 500 });
  }
}
