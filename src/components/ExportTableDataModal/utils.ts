function getValue(record: any, column: any) {
  if (typeof column.export === "function") {
    return avoidComma(column.export(record));
  }
  const { dataIndex } = column;
  if (dataIndex.includes(".")) {
    const depths = dataIndex.split(".");
    let result = record[depths[0]];
    for (let i = 1; i < depths.length; i++) {
      result = result[depths[i]];
    }
    return avoidComma(result);
  }
  return avoidComma(record[dataIndex]);
}

function avoidComma(value: any) {
  if (!value) return value;
  return String(value).includes(",") ? String(value).replace(",", "，") : value;
}

export function convertToCSV(data: any[], columns: any[]) {
  const columnsToExport = columns.filter(
    c => (c.export === undefined || typeof c.export === "function" || c.export) && c.dataIndex
  );
  let csv = columnsToExport.map(column => column.title).join(",") + "\r\n";
  data.forEach(
    record => (csv += columnsToExport.map(column => getValue(record, column)).join(",") + "\r\n")
  );
  return csv;
}

function getDownloadURL(csv: string) {
  if (window.Blob && window.URL && window.URL.createObjectURL) {
    const encoding = "\uFEFF"; // 使用utf-8编码防止中文乱码
    const data = new Blob([encoding + csv], { type: "text/csv" });
    return URL.createObjectURL(data);
  }
}

export default function downloadCSV(data: any[], columns: any[], download: boolean = true) {
  // 增加的download参数用于确定是否下载文件，当promise resolve之前，
  // 如果用户点击了取消按钮，便设置confirmLoading为false，
  // 可以使用confirmLoading作为是否要下载文件的判断依据。
  if (download) {
    const a = document.createElement("a");
    a.download = "数据报表.csv";
    let csv = "";
    try {
      csv = convertToCSV(data, columns);
    } catch (error) {
      console.log(error.message);
      throw Error("转换数据过程出现错误！");
    }
    try {
      a.href = getDownloadURL(csv);
    } catch {
      throw Error("CSV转换Blob的过程出现错误！（浏览器可能不支持）");
    }
    a.click();
  }
}
