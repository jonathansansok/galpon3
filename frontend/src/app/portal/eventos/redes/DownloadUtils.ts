//frontend\src\app\portal\eventos\redes\DownloadUtils.ts
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const downloadAsImage = async (elementId: string, filename: string, title: string) => {
  console.log('Iniciando descarga de imagen...');
  const element = document.getElementById(elementId);
  if (!element) {
    console.log('Elemento no encontrado:', elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, { useCORS: true, allowTaint: false });
    console.log('Canvas generado:', canvas);

    const dataUrl = canvas.toDataURL('image/png');
    console.log('Data URL generado:', dataUrl);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.png`;
    link.click();
    console.log('Imagen descargada:', filename);
  } catch (error) {
    console.error('Error al generar la imagen:', error);
  }
};

export const downloadAsPDF = async (elementId: string, filename: string, title: string) => {
  console.log('Iniciando descarga de PDF...');
  const element = document.getElementById(elementId);
  if (!element) {
    console.log('Elemento no encontrado:', elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, { useCORS: true, allowTaint: false });
    console.log('Canvas generado:', canvas);

    const dataUrl = canvas.toDataURL('image/png');
    console.log('Data URL generado:', dataUrl);

    const pdf = new jsPDF('landscape');
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const imgWidth = img.width;
      const imgHeight = img.height;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
      console.log('PDF descargado:', filename);
    };
  } catch (error) {
    console.error('Error al generar el PDF:', error);
  }
};

export const downloadAsExcel = (data: any[], title: string) => {
  console.log('Iniciando descarga de Excel...');
  const worksheetData = [
    [title.replace(/_/g, ' ')],
    ['Nombres', 'Apellidos', 'LPU'],
    ...data.map((interno) => [interno.nombres, interno.apellido, interno.lpu]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Internos');

  XLSX.writeFile(workbook, `${title}.xlsx`);
  console.log('Excel descargado:', title);
};