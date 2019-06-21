import React, { useState, useEffect, Fragment } from 'react';
import { Card, Button, Select, Table, DatePicker, Skeleton } from 'antd';

import { getBargainFunnel } from '@/services/stats';
import downloadCSV from '@/components/ExportTableDataModal/utils';
import useDocumentTitle from '@/hooks/useDocumentTitle';
// import { func } from 'prop-types';

const { RangePicker } = DatePicker;

export default function BargainFunnel() {
  const columns = [
    {
      title: '时间',
      dataIndex: 'date',
    },
    {
      title: '终端路径',
      dataIndex: 'client',
      filters: [
        { text: 'App', value: 'mina' },
        { text: '小程序', value: 'app' },
        { text: 'H5', value: 'h5' },
      ],
    },
    {
      title: '首页',
      dataIndex: 'index',
    },
    {
      title: '业务首页',
      dataIndex: 'list',
    },
    {
      title: '商家详情页',
      dataIndex: 'detail',
    },
    {
      title: '确认页',
      dataIndex: 'confirm',
    },
    {
      title: '支付页',
      dataIndex: 'pay',
    },
    {
      title: '支付成功',
      dataIndex: 'payed',
    },
  ];
  const [columnData, setColumnData] = useState(columns);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useDocumentTitle('砍价大盘漏斗');

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const res = await getBargainFunnel();
      setDataSource(res.data);
      setColumnData(columns);
      setIsLoading(false);
    })();
  }, []);

  function handleExport() {
    setExporting(true);
    downloadCSV(dataSource, columnData);
    setExporting(false);
  }

  function handleDateChange() {
    console.log('1');
  }

  async function handleSelectChange(e) {
    const res = await getBargainFunnel(`type=${e}`);
    setDataSource(res.data);
  }

  console.log('data: ', dataSource);

  return (
    <Card
      title="砍价大盘"
      extra={
        <Button type="primary" disabled={exporting} loading={exporting} onClick={handleExport}>
          导出数据
        </Button>
      }
    >
      {isLoading ? (
        <Skeleton loading={isLoading} active />
      ) : (
        <Fragment>
          <RangePicker style={{ padding: '0 20px 25px 0' }} onChange={handleDateChange} />
          <Select defaultValue="UV" onChange={handleSelectChange}>
            <Select.Option value="uv">UV</Select.Option>
            <Select.Option value="pv">PV</Select.Option>
          </Select>
          <Table columns={columnData} dataSource={dataSource} />
        </Fragment>
      )}
    </Card>
  );
}
