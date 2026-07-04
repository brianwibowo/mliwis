import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, renderToStream } from '@react-pdf/renderer';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ============================================================
// PDF Styles — Surat Keluar Resmi
// ============================================================
const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingBottom: 60,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    color: '#1a1a1a',
    lineHeight: 1.6,
  },
  // -- Kop Surat --
  headerContainer: {
    flexDirection: 'row',
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 24,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 14,
  },
  headerText: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  titleKab: {
    fontSize: 13,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#0f172a',
  },
  titleObj: {
    fontSize: 15,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    color: '#0f172a',
    marginTop: 2,
  },
  titleSub: {
    fontSize: 10,
    color: '#475569',
    marginTop: 3,
  },
  // -- Detail Surat (Nomor, Lamp, Perihal + Tanggal) --
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaLeft: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  metaLabel: {
    width: 70,
    fontSize: 12,
  },
  metaSeparator: {
    width: 12,
    fontSize: 12,
    textAlign: 'center',
  },
  metaValue: {
    flex: 1,
    fontSize: 12,
  },
  metaRight: {
    textAlign: 'right',
    fontSize: 12,
    flexShrink: 0,
  },
  // -- Tujuan --
  tujuanContainer: {
    marginBottom: 20,
  },
  tujuanLabel: {
    fontSize: 12,
  },
  tujuanNama: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textDecoration: 'underline',
  },
  tujuanTempat: {
    fontSize: 12,
    marginLeft: 48,
  },
  // -- Isi Surat --
  bodyText: {
    fontSize: 12,
    lineHeight: 1.8,
    textAlign: 'justify',
    marginBottom: 12,
  },
  bodyParagraph: {
    fontSize: 12,
    lineHeight: 1.8,
    textAlign: 'justify',
    textIndent: 48,
    marginBottom: 8,
  },
  // -- Penutup / TTD --
  signatureContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signatureBox: {
    width: 220,
    alignItems: 'center',
  },
  signDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  signRole: {
    fontSize: 12,
    marginBottom: 60,
  },
  signName: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textDecoration: 'underline',
  },
  signSub: {
    fontSize: 10,
    color: '#475569',
    marginTop: 2,
  },
});

// ============================================================
// PDF Document Component
// ============================================================
interface SuratData {
  nomorSurat: string;
  lampiran: string;
  perihal: string;
  tanggalSurat: string;
  tempatSurat: string;
  tujuan: string;
  tujuanAlamat: string;
  isiSurat: string;
  namaPenandatangan: string;
  jabatanPenandatangan: string;
}

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function formatTanggalSurat(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

const SuratPDFDocument = ({ data, logoPath, hasLogo }: { data: SuratData; logoPath: string; hasLogo: boolean }) => {
  const tanggalFormatted = formatTanggalSurat(data.tanggalSurat);

  // Split isi surat into paragraphs on double newline, or treat each line as a paragraph
  const paragraphs = data.isiSurat
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Kop Surat */}
        <View style={styles.headerContainer} fixed>
          {hasLogo && <Image src={logoPath} style={styles.logo} />}
          <View style={styles.headerText}>
            <Text style={styles.titleKab}>Pemerintah Kabupaten Kebumen</Text>
            <Text style={styles.titleObj}>Pengelola Obyek Wisata Pantai Mliwis</Text>
            <Text style={styles.titleSub}>Kecamatan Ambal, Kabupaten Kebumen, Jawa Tengah</Text>
          </View>
        </View>

        {/* Detail Surat */}
        <View style={styles.metaContainer}>
          <View style={styles.metaLeft}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Nomor</Text>
              <Text style={styles.metaSeparator}>:</Text>
              <Text style={styles.metaValue}>{data.nomorSurat}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Lampiran</Text>
              <Text style={styles.metaSeparator}>:</Text>
              <Text style={styles.metaValue}>{data.lampiran || '-'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Perihal</Text>
              <Text style={styles.metaSeparator}>:</Text>
              <Text style={styles.metaValue}>{data.perihal}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.metaRight}>{data.tempatSurat}, {tanggalFormatted}</Text>
          </View>
        </View>

        {/* Tujuan */}
        <View style={styles.tujuanContainer}>
          <Text style={styles.tujuanLabel}>Kepada Yth.</Text>
          <Text style={styles.tujuanNama}>{data.tujuan}</Text>
          {data.tujuanAlamat && (
            <Text style={styles.tujuanTempat}>di {data.tujuanAlamat}</Text>
          )}
        </View>

        {/* Isi Surat */}
        <View>
          {paragraphs.map((para, index) => (
            <Text key={index} style={styles.bodyParagraph}>
              {para}
            </Text>
          ))}
        </View>

        {/* Tanda Tangan */}
        <View style={styles.signatureContainer} wrap={false}>
          <View style={styles.signatureBox}>
            <Text style={styles.signDate}>{data.tempatSurat}, {tanggalFormatted}</Text>
            <Text style={styles.signRole}>{data.jabatanPenandatangan}</Text>
            <Text style={styles.signName}>{data.namaPenandatangan}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// ============================================================
// POST Handler
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = ['nomorSurat', 'perihal', 'tanggalSurat', 'tujuan', 'isiSurat', 'namaPenandatangan', 'jabatanPenandatangan'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field "${field}" wajib diisi.` }, { status: 400 });
      }
    }

    const data: SuratData = {
      nomorSurat: body.nomorSurat,
      lampiran: body.lampiran || '-',
      perihal: body.perihal,
      tanggalSurat: body.tanggalSurat,
      tempatSurat: body.tempatSurat || 'Kebumen',
      tujuan: body.tujuan,
      tujuanAlamat: body.tujuanAlamat || '',
      isiSurat: body.isiSurat,
      namaPenandatangan: body.namaPenandatangan,
      jabatanPenandatangan: body.jabatanPenandatangan,
    };

    const logoPath = path.join(process.cwd(), 'public', 'logo_mliwis.jpg');
    const hasLogo = fs.existsSync(logoPath);

    // Generate PDF stream
    const nodeStream = await renderToStream(
      <SuratPDFDocument data={data} logoPath={logoPath} hasLogo={hasLogo} />
    );

    // Convert Node.js stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      },
    });

    const safeNomor = data.nomorSurat.replace(/[^a-zA-Z0-9\-]/g, '_');
    const filename = `Surat-Keluar-${safeNomor}.pdf`;

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Gagal men-generate PDF surat keluar:', error);
    return NextResponse.json(
      { error: 'Gagal memproses file PDF surat keluar.' },
      { status: 500 }
    );
  }
}
