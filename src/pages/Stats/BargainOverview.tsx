import React, { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Table,
  Icon,
  Tooltip,
  Skeleton
} from 'antd'

import { getBargainOverview } from '@/services/stats';
import downloadCSV from '@/components/ExportTableDataModal/utils';
import useDocumentTitle from '@/hooks/useDocumentTitle';

export default function BargainOverview() {
  const [columnData, setColumnData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useDocumentTitle('砍价大盘');

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const res = await getBargainOverview();
      setColumnData(res.columns);
      setDataSource(res.dataSource);
      setIsLoading(false);
    })()
  }, []);

  function handleExport() {
    setExporting(true);
    downloadCSV(dataSource, columnData);
    setExporting(false);
  }

  console.log('data: ', dataSource);

  return (
      <Card 
        title="砍价大盘" 
        extra={
        <Button 
          type="primary"
          disabled={exporting}
          loading={exporting}
          onClick={handleExport}
        >
          导出数据
        </Button>}
      >
        {isLoading ? (
          <Skeleton loading={isLoading} active />
        ) : (
          <Table
            scroll={{ x: 1600 } || { x: true }}
            columns={columnData.map(c => ({
              ...c,
              title: (
                <Tooltip title={c.remark}>
                  <span>{ c.title }&nbsp;</span>
                  {c.remark && <Icon type="exclamation-circle" theme="twoTone" />}
                </Tooltip>
              )
            }))}
            dataSource={dataSource}
            pagination={false}
          />
        )
      }
    </Card>
  )
}
