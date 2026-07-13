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
    padding: 40,
    paddingBottom: 40,
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
    marginBottom: 15,
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
  headerLine1: {
    fontSize: 13,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    color: '#000000',
  },
  headerLine2: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    color: '#000000',
    marginTop: 2,
  },
  headerLine3: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginTop: 2,
  },
  headerLine4: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginTop: 2,
  },
  headerLine5: {
    fontSize: 8.5,
    fontFamily: 'Times-Roman',
    color: '#000000',
    marginTop: 3,
  },
  // -- Detail Surat (Nomor, Lamp, Perihal + Tanggal) --
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    marginBottom: 8,
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
    marginLeft: 0,
  },
  // -- Isi Surat --
  bodyText: {
    fontSize: 12,
    lineHeight: 1.8,
    textAlign: 'justify',
  },
  bodyParagraph: {
    fontSize: 12,
    lineHeight: 1.8,
    textAlign: 'justify',
    marginBottom: 6,
  },
  bodyTextIndent: {
    textIndent: 48,
  },
  detailsBlock: {
    marginLeft: 48,
    marginBottom: 6,
    flexDirection: 'column',
    gap: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    fontSize: 12,
    lineHeight: 1.8,
  },
  detailsKey: {
    width: 110,
    flexShrink: 0,
  },
  detailsColon: {
    width: 15,
    flexShrink: 0,
  },
  detailsValue: {
    flex: 1,
  },
  // -- Penutup / TTD --
  signatureContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signatureContainerDouble: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureContainerCenter: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signatureBox: {
    width: 220,
    alignItems: 'center',
  },
  signDate: {
    fontSize: 12,
    marginBottom: 4,
    minHeight: 18,
  },
  signRole: {
    fontSize: 12,
    marginBottom: 45,
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
  id?: number;
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
  namaPenandatangan2?: string;
  jabatanPenandatangan2?: string;
  namaPenandatangan3?: string;
  jabatanPenandatangan3?: string;
}

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function formatTanggalSurat(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

function parseParagraphContent(text: string) {
  const lines = text.split('\n');
  const blocks: any[] = [];
  let currentDetails: any[] = [];

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    let isDetail = false;
    let key = '';
    let val = '';

    if (colonIndex > 0) {
      key = line.substring(0, colonIndex).trim();
      val = line.substring(colonIndex + 1).trim();
      if (key.length > 0 && key.length <= 25 && val.length > 0) {
        const firstWord = key.split(' ')[0].toLowerCase();
        const commonParagraphWords = ['dengan', 'bahwa', 'sehubungan', 'kami', 'saya', 'adalah'];
        if (!commonParagraphWords.includes(firstWord)) {
          isDetail = true;
        }
      }
    }

    if (isDetail) {
      currentDetails.push({ key, value: val });
    } else {
      if (currentDetails.length > 0) {
        blocks.push({ type: 'details', items: currentDetails });
        currentDetails = [];
      }
      blocks.push({ type: 'text', content: line });
    }
  }

  if (currentDetails.length > 0) {
    blocks.push({ type: 'details', items: currentDetails });
  }

  return blocks;
}

const SuratPDFDocument = ({ data, logoPath, hasLogo }: { data: SuratData; logoPath: string; hasLogo: boolean }) => {
  const tanggalFormatted = formatTanggalSurat(data.tanggalSurat);

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
            <Text style={styles.headerLine1}>PEMERINTAH DESA KENOYOJAYAN</Text>
            <Text style={styles.headerLine2}>KELOMPOK SADAR WISATA (POKDARWIS) “PANTAI MLIWIS”</Text>
            <Text style={styles.headerLine3}>Desa Kenoyojayan Kecamatan Ambal</Text>
            <Text style={styles.headerLine4}>Kabupaten Kebumen Provinsi Jawa Tengah</Text>
            <Text style={styles.headerLine5}>Sekretariat: Kawasan Wisata Pantai Mliwis, Desa Kenoyojayan, Ambal, Kebumen 54392</Text>
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
          {paragraphs.map((para, index) => {
            const blocks = parseParagraphContent(para);
            return (
              <View key={index} style={{ marginBottom: 8 }}>
                {blocks.map((block, bIdx) => {
                  if (block.type === 'text') {
                    const textStyle = bIdx === 0
                      ? [styles.bodyParagraph, styles.bodyTextIndent]
                      : styles.bodyParagraph;
                    return (
                      <Text key={bIdx} style={textStyle}>
                        {block.content}
                      </Text>
                    );
                  } else {
                    return (
                      <View key={bIdx} style={styles.detailsBlock}>
                        {block.items.map((item: any, idx: number) => (
                          <View key={idx} style={styles.detailsRow}>
                            <Text style={styles.detailsKey}>{item.key}</Text>
                            <Text style={styles.detailsColon}>:</Text>
                            <Text style={styles.detailsValue}>{item.value}</Text>
                          </View>
                        ))}
                      </View>
                    );
                  }
                })}
              </View>
            );
          })}
        </View>

        {/* Tanda Tangan */}
        <View wrap={false}>
          {!data.namaPenandatangan2 && !data.namaPenandatangan3 ? (
            // Kasus 1: Hanya 1 Tanda Tangan (Rata Kanan)
            <View style={styles.signatureContainer}>
              <View style={styles.signatureBox}>
                <Text style={styles.signDate}>{data.tempatSurat}, {tanggalFormatted}</Text>
                <Text style={styles.signRole}>{data.jabatanPenandatangan}</Text>
                <Text style={styles.signName}>{data.namaPenandatangan}</Text>
              </View>
            </View>
          ) : !data.namaPenandatangan3 ? (
            // Kasus 2: 2 Tanda Tangan (Sejajar Kiri & Kanan)
            <View style={styles.signatureContainerDouble}>
              <View style={styles.signatureBox}>
                <Text style={styles.signDate}> </Text>
                <Text style={styles.signRole}>{data.jabatanPenandatangan2}</Text>
                <Text style={styles.signName}>{data.namaPenandatangan2}</Text>
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signDate}>{data.tempatSurat}, {tanggalFormatted}</Text>
                <Text style={styles.signRole}>{data.jabatanPenandatangan}</Text>
                <Text style={styles.signName}>{data.namaPenandatangan}</Text>
              </View>
            </View>
          ) : (
            // Kasus 3: 3 Tanda Tangan (Baris 1: Kiri & Kanan, Baris 2: Tengah Bawah)
            <View>
              <View style={styles.signatureContainerDouble}>
                <View style={styles.signatureBox}>
                  <Text style={styles.signDate}> </Text>
                  <Text style={styles.signRole}>{data.jabatanPenandatangan2}</Text>
                  <Text style={styles.signName}>{data.namaPenandatangan2}</Text>
                </View>
                <View style={styles.signatureBox}>
                  <Text style={styles.signDate}>{data.tempatSurat}, {tanggalFormatted}</Text>
                  <Text style={styles.signRole}>{data.jabatanPenandatangan}</Text>
                  <Text style={styles.signName}>{data.namaPenandatangan}</Text>
                </View>
              </View>
              <View style={styles.signatureContainerCenter}>
                <View style={styles.signatureBox}>
                  <Text style={styles.signRole}>{data.jabatanPenandatangan3}</Text>
                  <Text style={styles.signName}>{data.namaPenandatangan3}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { put } from '@vercel/blob';

// ============================================================
// POST Handler — Generate, Save, & Archive PDF
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const requiredFields = ['nomorSurat', 'perihal', 'tanggalSurat', 'tujuan', 'isiSurat', 'namaPenandatangan', 'jabatanPenandatangan'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field "${field}" wajib diisi.` }, { status: 400 });
      }
    }

    const data: SuratData = {
      id: body.id ? Number(body.id) : undefined,
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
      namaPenandatangan2: body.namaPenandatangan2 || undefined,
      jabatanPenandatangan2: body.jabatanPenandatangan2 || undefined,
      namaPenandatangan3: body.namaPenandatangan3 || undefined,
      jabatanPenandatangan3: body.jabatanPenandatangan3 || undefined,
    };

    const logoPath = path.join(process.cwd(), 'public', 'logo_mliwis.jpg');
    const hasLogo = fs.existsSync(logoPath);

    // Generate PDF stream
    const nodeStream = await renderToStream(
      <SuratPDFDocument data={data} logoPath={logoPath} hasLogo={hasLogo} />
    );

    // Convert stream to Buffer
    const chunks: any[] = [];
    for await (const chunk of nodeStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const safeNomor = data.nomorSurat.replace(/[^a-zA-Z0-9\-]/g, '_');
    const filename = `Surat-Keluar-${safeNomor}-${Date.now()}.pdf`;
    let savedFilePath = '';

    // Upload/Save file to storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${filename}`, buffer, {
        access: 'public',
        contentType: 'application/pdf',
      });
      savedFilePath = blob.url;
    } else {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.promises.mkdir(uploadsDir, { recursive: true });
      const fullPath = path.join(uploadsDir, filename);
      await fs.promises.writeFile(fullPath, buffer);
      savedFilePath = `/uploads/${filename}`;
    }

    // Save record to Database
    if (data.id) {
      await prisma.suratKeluar.update({
        where: { id: Number(data.id) },
        data: {
          nomorSurat: data.nomorSurat,
          tanggalSurat: new Date(data.tanggalSurat),
          tujuan: data.tujuan,
          perihal: data.perihal,
          filePath: savedFilePath,
          namaFile: filename,
          isiSurat: data.isiSurat,
          tempatSurat: data.tempatSurat,
          tujuanAlamat: data.tujuanAlamat || null,
          lampiran: data.lampiran || null,
          namaPenandatangan: data.namaPenandatangan,
          jabatanPenandatangan: data.jabatanPenandatangan,
          namaPenandatangan2: data.namaPenandatangan2 || null,
          jabatanPenandatangan2: data.jabatanPenandatangan2 || null,
          namaPenandatangan3: data.namaPenandatangan3 || null,
          jabatanPenandatangan3: data.jabatanPenandatangan3 || null,
        },
      });

      await logAudit(
        'UPDATE_SURAT_KELUAR',
        `Surat keluar otomatis diperbarui: No. "${data.nomorSurat}" ke "${data.tujuan}"`
      );
    } else {
      await prisma.suratKeluar.create({
        data: {
          nomorSurat: data.nomorSurat,
          tanggalSurat: new Date(data.tanggalSurat),
          pengirim: 'Pengelola Pantai Mliwis',
          tujuan: data.tujuan,
          perihal: data.perihal,
          filePath: savedFilePath,
          namaFile: filename,
          userId: session.userId,
          isiSurat: data.isiSurat,
          tempatSurat: data.tempatSurat,
          tujuanAlamat: data.tujuanAlamat || null,
          lampiran: data.lampiran || null,
          namaPenandatangan: data.namaPenandatangan,
          jabatanPenandatangan: data.jabatanPenandatangan,
          namaPenandatangan2: data.namaPenandatangan2 || null,
          jabatanPenandatangan2: data.jabatanPenandatangan2 || null,
          namaPenandatangan3: data.namaPenandatangan3 || null,
          jabatanPenandatangan3: data.jabatanPenandatangan3 || null,
        },
      });

      await logAudit(
        'CREATE_SURAT_KELUAR',
        `Surat keluar otomatis dibuat: No. "${data.nomorSurat}" ke "${data.tujuan}"`
      );
    }

    return NextResponse.json({ success: true, filePath: savedFilePath });
  } catch (error: any) {
    console.error('Gagal memproses pembuatan surat keluar otomatis:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memproses file PDF surat keluar.' },
      { status: 500 }
    );
  }
}
