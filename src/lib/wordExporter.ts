/**
 * Word (.doc) Document Exporter for SABDA BK SPANJU
 */

export function exportHtmlToWord(htmlContent: string, fileName: string) {
  const header = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${fileName}</title>
<style>
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.3;
    color: #000000;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  th, td {
    border: 1px solid #000000;
    padding: 6px 8px;
    font-size: 11pt;
    vertical-align: top;
  }
  th {
    background-color: #f2f2f2;
    text-align: center;
    font-weight: bold;
  }
  .kop-container {
    text-align: center;
    border-bottom: 3px double #000000;
    padding-bottom: 8px;
    margin-bottom: 16px;
  }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-bold { font-weight: bold; }
  .underline { text-decoration: underline; }
  .no-border td { border: none; }
</style>
</head>
<body>
${htmlContent}
</body>
</html>`;

  const blob = new Blob(['\ufeff', header], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
