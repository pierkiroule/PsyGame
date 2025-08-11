import { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableCell, TableRow, WidthType, AlignmentType, HeadingLevel } from 'docx';
import * as JSZip from 'jszip';
import type { Psychography } from '@shared/schema';

interface PsychographyForExport extends Psychography {
  user?: { username: string };
}

export async function generateDocxPack(psychographies: PsychographyForExport[], requesterUsername: string): Promise<{ filename: string; buffer: Buffer }> {
  const zip = new JSZip();
  
  // Generate individual DOCX files
  for (const psycho of psychographies) {
    const doc = await generateSingleDocx(psycho);
    const buffer = await Packer.toBuffer(doc);
    const filename = `${sanitizeFilename(psycho.title)}.docx`;
    zip.file(filename, buffer);
  }
  
  // Add a summary document
  const summaryDoc = await generateSummaryDocx(psychographies, requesterUsername);
  const summaryBuffer = await Packer.toBuffer(summaryDoc);
  zip.file('00_Sommaire_Pack_Psychographies.docx', summaryBuffer);
  
  // Generate ZIP
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  const packFilename = `Psychographies_Pack_${new Date().toISOString().split('T')[0]}.zip`;
  
  return {
    filename: packFilename,
    buffer: zipBuffer
  };
}

async function generateSingleDocx(psycho: PsychographyForExport): Promise<Document> {
  const paragraphs: Paragraph[] = [];
  
  // Header with logo area and app info
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "PSYCHOGRAPHE",
          bold: true,
          size: 32,
          color: "3B82F6"
        }),
        new TextRun({
          text: " - Studio Psychographique",
          size: 24,
          color: "64748B"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: "Création générée par l'IA collaborative",
          italics: true,
          size: 20,
          color: "64748B"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 }
    })
  );

  // Title
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: psycho.title,
          bold: true,
          size: 28,
          color: "1E293B"
        })
      ],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  // Metadata table
  const metadataTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Créé par:", bold: true })] })],
            width: { size: 30, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: psycho.user?.username || "Anonyme" })] })],
            width: { size: 70, type: WidthType.PERCENTAGE }
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Date de création:", bold: true })] })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: new Date(psycho.createdAt).toLocaleDateString('fr-FR') })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Tags:", bold: true })] })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: psycho.tags.join(', ') })] })]
          })
        ]
      })
    ],
    margins: { top: 100, bottom: 100, left: 100, right: 100 }
  });

  paragraphs.push(
    new Paragraph({ children: [metadataTable], spacing: { after: 600 } })
  );

  // Texte initial section
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Texte Initial",
          bold: true,
          size: 24,
          color: "3B82F6"
        })
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: psycho.initialText,
          size: 22
        })
      ],
      spacing: { after: 400 }
    })
  );

  // Prompt enrichi section
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Prompt Enrichi Généré",
          bold: true,
          size: 24,
          color: "3B82F6"
        })
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: psycho.finalPrompt,
          size: 18,
          font: "Courier New",
          color: "475569"
        })
      ],
      spacing: { after: 400 }
    })
  );

  // Texte créatif section
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Texte Créatif Généré",
          bold: true,
          size: 24,
          color: "3B82F6"
        })
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    })
  );

  // Split generated text into paragraphs
  const textParagraphs = psycho.generatedText.split('\n\n');
  textParagraphs.forEach(para => {
    if (para.trim()) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: para.trim(),
              size: 22
            })
          ],
          spacing: { after: 200 }
        })
      );
    }
  });

  // Guide d'accompagnement section
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Guide d'Accompagnement",
          bold: true,
          size: 24,
          color: "3B82F6"
        })
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: psycho.guide,
          size: 20
        })
      ],
      spacing: { after: 600 }
    })
  );

  // Footer with legal mentions
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "───────────────────────────────────────────────────────",
          color: "CBD5E1"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 200 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: "Généré par Psychographe - Studio Psychographique",
          bold: true,
          size: 18,
          color: "475569"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: "Application de brainstorming projectif et résonant",
          italics: true,
          size: 16,
          color: "64748B"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: "🌐 psychographe.replit.app",
          size: 16,
          color: "3B82F6"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: `Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
          size: 14,
          color: "9CA3AF"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: "© 2025 Psychographe - Tous droits réservés",
          size: 12,
          color: "9CA3AF"
        })
      ],
      alignment: AlignmentType.CENTER
    })
  );

  return new Document({
    sections: [{
      properties: {},
      children: paragraphs
    }]
  });
}

async function generateSummaryDocx(psychographies: PsychographyForExport[], requesterUsername: string): Promise<Document> {
  const paragraphs: Paragraph[] = [];
  
  // Header
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "PACK PSYCHOGRAPHIES",
          bold: true,
          size: 36,
          color: "3B82F6"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: `Pack téléchargé par ${requesterUsername}`,
          size: 24,
          color: "64748B"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: `Date de téléchargement: ${new Date().toLocaleDateString('fr-FR')}`,
          size: 20,
          color: "64748B"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 }
    })
  );

  // Summary table
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Contenu du Pack",
          bold: true,
          size: 28
        })
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 300 }
    })
  );

  // Create summary table
  const summaryRows = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Titre", bold: true })] })],
          width: { size: 40, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Créé par", bold: true })] })],
          width: { size: 20, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Date", bold: true })] })],
          width: { size: 20, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Tags", bold: true })] })],
          width: { size: 20, type: WidthType.PERCENTAGE }
        })
      ]
    })
  ];

  psychographies.forEach(psycho => {
    summaryRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: psycho.title })] })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: psycho.user?.username || "Anonyme" })] })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: new Date(psycho.createdAt).toLocaleDateString('fr-FR') })] })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: psycho.tags.slice(0, 3).join(', ') })] })]
          })
        ]
      })
    );
  });

  const summaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: summaryRows
  });

  paragraphs.push(
    new Paragraph({ children: [summaryTable], spacing: { after: 600 } })
  );

  // Statistics
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Statistiques du Pack",
          bold: true,
          size: 24
        })
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 200 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ text: `• Nombre de psychographies: `, bold: true }),
        new TextRun({ text: psychographies.length.toString() })
      ],
      spacing: { after: 100 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ text: `• Nombre total de mots: `, bold: true }),
        new TextRun({ text: psychographies.reduce((acc, p) => acc + p.generatedText.split(' ').length, 0).toString() })
      ],
      spacing: { after: 100 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ text: `• Tags uniques: `, bold: true }),
        new TextRun({ text: [...new Set(psychographies.flatMap(p => p.tags))].length.toString() })
      ],
      spacing: { after: 400 }
    })
  );

  // Footer
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Généré par Psychographe - Studio Psychographique",
          bold: true,
          size: 18,
          color: "475569"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 100 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: "🌐 psychographe.replit.app",
          size: 16,
          color: "3B82F6"
        })
      ],
      alignment: AlignmentType.CENTER
    })
  );

  return new Document({
    sections: [{
      properties: {},
      children: paragraphs
    }]
  });
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 100);
}