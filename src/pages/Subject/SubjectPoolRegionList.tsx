import React from 'react';
import {
  Card,
  Table,
  Button
} from 'antd';
import useTableList from '@/hooks/useTableList';
import { getSubjectPools } from '@/services/subject';
import Link from 'umi/link';
import { getUrl } from '@/utils/routes';
import { navigateTo } from "@/utils/routes";

export default function SubjectPoolRegionList() {
  const { tableProps } = useTableList({ fetchData: getSubjectPools });
  
  const columns = [
    {
      title: '板块名称',
      dataIndex: 'name'
    },
    {
      title: '控制范围',
      dataIndex: 'total_count'
    },
    {
      title: '博主库',
      dataIndex: 'pool-type10',
      render: (_, record) => (
        <span>
          { (record.pools.find(pool => pool.type === 10)).subject_count }
        </span>
      )
    },
    {
      title: '推荐库',
      dataIndex: 'pool-type20',
      render: (_, record) => (
        <span>
          { (record.pools.find(pool => pool.type === 20)).subject_count }
        </span>
      )
    },
    {
      title: '文章库',
      dataIndex: 'pool-type30',
      render: (_, record) => (
        <span>
          { (record.pools.find(pool => pool.type === 30)).subject_count }
        </span>
      )
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      render: (_, record) => (
        <span>
          <Link to={getUrl('user-detail', record.operator.id)}>
            { record.operator.name }
          </Link>
        </span>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at'
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: value => (
        <span>
          { value === 1 ? '上线' : '下线' }
        </span>
      )
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: () => (
        <span>配置</span>
      )
    }
  ]
  return (
    <Card
      title="推送设置"
      extra={(
        <Button
          type="primary"
          onClick={() => navigateTo('create-subject-pool')}
        >
          创建板块
        </Button>
      )}
    >
      <Table
        columns={ columns }
        { ...tableProps }
      />
    </Card>
  )
}
