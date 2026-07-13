import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ImageRun } from 'docx'

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

function formatTanggalSurat(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`
}

function parseParagraphContent(text: string) {
  const lines = text.split('\n')
  const blocks: any[] = []
  let currentDetails: any[] = []

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    let isDetail = false
    let key = ''
    let val = ''

    if (colonIndex > 0) {
      key = line.substring(0, colonIndex).trim()
      val = line.substring(colonIndex + 1).trim()
      if (key.length > 0 && key.length <= 25 && val.length > 0) {
        const firstWord = key.split(' ')[0].toLowerCase()
        const commonParagraphWords = ['dengan', 'bahwa', 'sehubungan', 'kami', 'saya', 'adalah']
        if (!commonParagraphWords.includes(firstWord)) {
          isDetail = true
        }
      }
    }

    if (isDetail) {
      currentDetails.push({ key, value: val })
    } else {
      if (currentDetails.length > 0) {
        blocks.push({ type: 'details', items: currentDetails })
        currentDetails = []
      }
      blocks.push({ type: 'text', content: line })
    }
  }

  if (currentDetails.length > 0) {
    blocks.push({ type: 'details', items: currentDetails })
  }

  return blocks
}

export async function generateAndDownloadDocx(templateForm: any, activeSignaturesCount: number) {
  let kopElement: any = null

  try {
    const logoResponse = await fetch('/logo_mliwis.jpg')
    if (!logoResponse.ok) {
      throw new Error("Logo fetch failed")
    }
    const logoBuffer = await logoResponse.arrayBuffer()

    kopElement = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 15, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new ImageRun({
                      data: new Uint8Array(logoBuffer),
                      transformation: {
                        width: 70,
                        height: 70,
                      },
                      type: 'jpg'
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              width: { size: 85, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 240 },
                  children: [
                    new TextRun({
                      text: "PEMERINTAH DESA KENOYOJAYAN",
                      bold: true,
                      size: 26, // 13pt
                      font: "Times New Roman"
                    })
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 240 },
                  children: [
                    new TextRun({
                      text: 'KELOMPOK SADAR WISATA (POKDARWIS) "PANTAI MLIWIS"',
                      bold: true,
                      size: 28, // 14pt
                      font: "Times New Roman"
                    })
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 240 },
                  children: [
                    new TextRun({
                      text: "Desa Kenoyojayan Kecamatan Ambal",
                      bold: true,
                      size: 22, // 11pt
                      font: "Times New Roman"
                    })
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 240 },
                  children: [
                    new TextRun({
                      text: "Kabupaten Kebumen Provinsi Jawa Tengah",
                      bold: true,
                      size: 22, // 11pt
                      font: "Times New Roman"
                    })
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 240 },
                  children: [
                    new TextRun({
                      text: "Sekretariat: Kawasan Wisata Pantai Mliwis, Desa Kenoyojayan, Ambal, Kebumen 54392",
                      size: 17, // 8.5pt
                      font: "Times New Roman"
                    })
                  ]
                }),
              ]
            })
          ]
        })
      ]
    })
  } catch (err) {
    console.error("Gagal memuat logo untuk docx, menggunakan teks kop biasa:", err)
    
    // Fallback: Kop tanpa logo dengan spacing yang diatur rapat
    kopElement = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 240 },
                  children: [
                    new TextRun({
                      text: "PEMERINTAH DESA KENOYOJAYAN",
                      bold: true,
                      size: 26,
                      font: "Times New Roman"
                    })
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 240 },
                  children: [
                    new TextRun({
                      text: 'KELOMPOK SADAR WISATA (POKDARWIS) "PANTAI MLIWIS"',
                      bold: true,
                      size: 28,
                      font: "Times New Roman"
                    })
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 240 },
                  children: [
                    new TextRun({
                      text: "Desa Kenoyojayan Kecamatan Ambal",
                      bold: true,
                      size: 22,
                      font: "Times New Roman"
                    })
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 240 },
                  children: [
                    new TextRun({
                      text: "Kabupaten Kebumen Provinsi Jawa Tengah",
                      bold: true,
                      size: 22,
                      font: "Times New Roman"
                    })
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 240 },
                  children: [
                    new TextRun({
                      text: "Sekretariat: Kawasan Wisata Pantai Mliwis, Desa Kenoyojayan, Ambal, Kebumen 54392",
                      size: 17,
                      font: "Times New Roman"
                    })
                  ]
                }),
              ]
            })
          ]
        })
      ]
    })
  }

  // Horizontal line separator
  const lineSeparator = new Paragraph({
    border: {
      bottom: {
        color: "000000",
        space: 4,
        style: BorderStyle.SINGLE,
        size: 24, // 3pt
      }
    },
    children: []
  })

  const metadataTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Nomor     : ", font: "Times New Roman", size: 24 }),
                  new TextRun({ text: templateForm.nomorSurat, bold: true, font: "Times New Roman", size: 24 }),
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Lampiran  : ", font: "Times New Roman", size: 24 }),
                  new TextRun({ text: templateForm.lampiran || "-", font: "Times New Roman", size: 24 }),
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Perihal   : ", font: "Times New Roman", size: 24 }),
                  new TextRun({ text: templateForm.perihal, font: "Times New Roman", size: 24 }),
                ]
              }),
            ]
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ 
                    text: `${templateForm.tempatSurat}, ${formatTanggalSurat(templateForm.tanggalSurat)}`, 
                    font: "Times New Roman", 
                    size: 24 
                  }),
                ]
              }),
            ]
          }),
        ]
      })
    ]
  })

  const tujuanParagraphs = [
    new Paragraph({ spacing: { before: 240 }, children: [new TextRun({ text: "Kepada Yth.", font: "Times New Roman", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: templateForm.tujuan, bold: true, font: "Times New Roman", size: 24 })] }),
  ]
  if (templateForm.tujuanAlamat) {
    tujuanParagraphs.push(
      new Paragraph({ children: [new TextRun({ text: `di ${templateForm.tujuanAlamat}`, font: "Times New Roman", size: 24 })] })
    )
  }

  const bodyParagraphs = []
  const rawParas = templateForm.isiSurat
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0)

  for (const para of rawParas) {
    const blocks = parseParagraphContent(para)
    
    for (let bIdx = 0; bIdx < blocks.length; bIdx++) {
      const block = blocks[bIdx]
      if (block.type === 'text') {
        bodyParagraphs.push(
          new Paragraph({
            indent: bIdx === 0 ? { firstLine: 720 } : undefined,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 120, after: 120 },
            children: [
              new TextRun({
                text: block.content,
                font: "Times New Roman",
                size: 24, // 12pt
              })
            ]
          })
        )
      } else {
        const detailsTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: block.items.map((item: any) => (
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 8, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({ children: [] })]
                }),
                new TableCell({
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: item.key, font: "Times New Roman", size: 24 })]
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 3, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: ":", font: "Times New Roman", size: 24 })]
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 64, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: item.value, font: "Times New Roman", size: 24 })]
                    })
                  ]
                }),
              ]
            })
          ))
        })
        
        bodyParagraphs.push(detailsTable)
      }
    }
  }

  const buildSignatureTable = () => {
    if (activeSignaturesCount === 1) {
      return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 55, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [] })]
              }),
              new TableCell({
                width: { size: 45, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ 
                        text: `${templateForm.tempatSurat}, ${formatTanggalSurat(templateForm.tanggalSurat)}`, 
                        font: "Times New Roman", 
                        size: 24 
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: templateForm.jabatanPenandatangan, font: "Times New Roman", size: 24 })]
                  }),
                  new Paragraph({
                    spacing: { before: 1200 },
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: templateForm.namaPenandatangan, bold: true, underline: {}, font: "Times New Roman", size: 24 })]
                  }),
                ]
              })
            ]
          })
        ]
      })
    } else if (activeSignaturesCount === 2) {
      return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: " ", font: "Times New Roman", size: 24 })]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: templateForm.jabatanPenandatangan2, font: "Times New Roman", size: 24 })]
                  }),
                  new Paragraph({
                    spacing: { before: 1200 },
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: templateForm.namaPenandatangan2, bold: true, underline: {}, font: "Times New Roman", size: 24 })]
                  }),
                ]
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ 
                        text: `${templateForm.tempatSurat}, ${formatTanggalSurat(templateForm.tanggalSurat)}`, 
                        font: "Times New Roman", 
                        size: 24 
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: templateForm.jabatanPenandatangan, font: "Times New Roman", size: 24 })]
                  }),
                  new Paragraph({
                    spacing: { before: 1200 },
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: templateForm.namaPenandatangan, bold: true, underline: {}, font: "Times New Roman", size: 24 })]
                  }),
                ]
              })
            ]
          })
        ]
      })
    } else {
      return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: " ", font: "Times New Roman", size: 24 })]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: templateForm.jabatanPenandatangan2, font: "Times New Roman", size: 24 })]
                  }),
                  new Paragraph({
                    spacing: { before: 1200 },
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: templateForm.namaPenandatangan2, bold: true, underline: {}, font: "Times New Roman", size: 24 })]
                  }),
                ]
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ 
                        text: `${templateForm.tempatSurat}, ${formatTanggalSurat(templateForm.tanggalSurat)}`, 
                        font: "Times New Roman", 
                        size: 24 
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: templateForm.jabatanPenandatangan, font: "Times New Roman", size: 24 })]
                  }),
                  new Paragraph({
                    spacing: { before: 1200 },
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: templateForm.namaPenandatangan, bold: true, underline: {}, font: "Times New Roman", size: 24 })]
                  }),
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                columnSpan: 2,
                children: [new Paragraph({ spacing: { before: 300 } })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                columnSpan: 2,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: templateForm.jabatanPenandatangan3, font: "Times New Roman", size: 24 })]
                  }),
                  new Paragraph({
                    spacing: { before: 1200 },
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: templateForm.namaPenandatangan3, bold: true, underline: {}, font: "Times New Roman", size: 24 })]
                  }),
                ]
              })
            ]
          })
        ]
      })
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          kopElement,
          lineSeparator,
          new Paragraph({ spacing: { before: 240 } }),
          metadataTable,
          new Paragraph({ spacing: { before: 240 } }),
          ...tujuanParagraphs,
          ...bodyParagraphs,
          new Paragraph({ spacing: { before: 360 } }),
          buildSignatureTable(),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  const safeNomor = templateForm.nomorSurat.replace(/[^a-zA-Z0-9\-]/g, '_')
  a.download = `Surat-Keluar-${safeNomor}.docx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
