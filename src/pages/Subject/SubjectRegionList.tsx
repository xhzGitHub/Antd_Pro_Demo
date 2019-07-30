import React from 'react';
import { 
  Card,
  Table,
  Button,
  Icon
} from 'antd';
import useTableList from '@/hooks/useTableList';
import {
  getSubjectRegionList,
  setRegionOnlineStatus
} from '@/services/subject';
import { getUrl } from '@/utils/routes';
import { navigateTo } from "@/utils/routes";
import Link from "umi/link";

export default function SubjectRegionList() {
  const { tableProps, refreshList } = useTableList({ fetchData: getSubjectRegionList });
  const columns = [
    {
      title: '商圈名称',
      dataIndex: 'name'
    },
    {
      title: '展示图片',
      dataIndex: 'image',
      render: value => (
        <img src={value} style={{ width: '100px', height: '100px' }} />
      )
    },
    {
      title: '展示文案',
      dataIndex: 'description'
    },
    {
      title: 'POI数',
      dataIndex: 'poi_count'
    },
    {
      title: '关联文章数',
      dataIndex: 'subject_count'
    },
    {
      title: '操作人',
      dataIndex: 'operator'
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at'
    },
    // {
    //   title: '展示顺序',
    //   dataIndex: 'updated_at'
    // },
    {
      title: '在线状态',
      dataIndex: 'online',
      render: (value, record) => (
        <div>
          { value === 1 ? (
            <a
              style={{ color: '#1890FF' }}
              onClick={ async () => {
                const res = await setRegionOnlineStatus({
                  id: record.id,
                  payload: { online: 0 }
                });
                if (res && res.errcode === 0) {
                  refreshList();
                }
              }}  
            >
              在线&nbsp;
              <Icon type="caret-down" />
            </a>
          ) : (
            <a
              style={{ color: '#1890FF' }}
              onClick={ async () => {
                const res = await setRegionOnlineStatus({
                  id: record.id,
                  payload: { online: 1 }
                });
                if (res && res.errcode === 0) {
                  refreshList();
                }
              }}  
            >
              下线&nbsp;
              <Icon type="caret-up" />
            </a>
          ) }
        </div>
      )
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_, record) => (
        <Link to={getUrl("subject-region", record.id)}>配置</Link>
      )
    }
  ]
  return (
    <Card
      title="热门商圈列表"
      extra={(
        <Button
          type='primary'
          onClick={() => navigateTo('create-subject-region')} 
        >
          新增商圈
        </Button>
      )}
    >
      <Table 
        rowKey="id"
        columns={ columns }
        { ...tableProps }
      />
    </Card>
  )
}
