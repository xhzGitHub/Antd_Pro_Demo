import React, { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { Card, Button, Select, Table, DatePicker, Input, Switch } from 'antd';
import { getBargainShopFunnel } from '@/services/stats';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useTableList, { ExportColumnProps } from '@/hooks/useTableList';
import { CLIENTS } from './constants';
import moment from 'moment';
import { debounce } from 'lodash';

const DATE_FORMATE = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const { Search } = Input;

export default function BargainFunnel() {
  const columns = useMemo<Array<ExportColumnProps<any>>>(
    () => [
      {
        title: '时间',
        dataIndex: 'date',
      },
      {
        title: '商户名',
        dataIndex: 'shop_name',
      },
      {
        title: '商户ID',
        dataIndex: 'shop_id',
      },
      {
        title: '城市',
        dataIndex: 'city',
      },
      {
        title: '终端/路径',
        dataIndex: 'client',
        filters: CLIENTS,
      },
      {
        title: '曝光量',
        dataIndex: 'exposure',
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
    ],
    []
  );

  const [columnData, setColumnData] = useState(columns);

  useDocumentTitle('砍价商铺漏斗');
  const { tableProps, getColumns, getFilter, setFilters } = useTableList({
    fetchData: getBargainShopFunnel,
  });

  const startAt = getFilter('start_at');
  const endAt = getFilter('end_at');
  const range: any = startAt && endAt ? [moment(startAt), moment(endAt)] : [];
  const isValid: boolean = Number(getFilter('is_valid')) === 1;

  const handleSearchShopId = useCallback(
    debounce((value: string) => {
      setFilters({ shop_id: value });
    }),
    [setFilters]
  );

  const handleSwitchIsValid = useCallback(() => {
    setFilters({ is_valid: isValid ? 0 : 1 });
  }, [setFilters]);

  const renderTableTitle = useCallback(
    () => (
      <Fragment>
        <RangePicker
          format={DATE_FORMATE}
          value={range}
          onChange={(_, dataStrings) => {
            setFilters({
              start_at: dataStrings[0],
              end_at: dataStrings[1],
            });
          }}
        />
        <Search
          style={{ width: '170px', paddingLeft: '20px' }}
          placeholder="搜 商户ID"
          defaultValue={getFilter('shop_id')}
          onSearch={handleSearchShopId}
        />
        &nbsp;&nbsp;&nbsp;只看有效&nbsp;&nbsp;
        <Switch checked={isValid} onChange={handleSwitchIsValid} />
      </Fragment>
    ),
    [getFilter]
  );

  return (
    <Card title="砍价商铺" extra={<Button type="primary">导出数据</Button>}>
      <Table
        scroll={{ x: true }}
        rowKey={(_, index) => index.toString()}
        columns={getColumns(columnData)}
        title={renderTableTitle}
        {...tableProps}
      />
    </Card>
  );
}
