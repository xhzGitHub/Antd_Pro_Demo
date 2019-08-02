import React, { Fragment, useReducer, useEffect } from 'react';
import {
  Collapse,
  Card,
  Table
} from 'antd';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useTableList from '@/hooks/useTableList';
import {
  getStatisticGraph,
  getSubjectList
} from '@/services/subject';

interface State {
  statisticsGraphUrl: string;
}

type Action =
  | { type: 'INIT'; payload: State };

const { Panel } = Collapse;

const initialState = {
  statisticsGraphUrl: ''
} as State;

const reducer = (state: State, action: Action) => {
  switch(action.type) {
    case 'INIT':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default function SubjectList() {
  useDocumentTitle('主题列表');
  const { tableProps } = useTableList({
    fetchData: getSubjectList
  });

  const [state, dispatch] = useReducer(reducer, initialState);


  console.log('tableProps', tableProps);

  useEffect(() => {
    (async () => {
      const statisticsGraphUrl = await getStatisticGraph();
      dispatch({
        type: 'INIT',
        payload: {
          statisticsGraphUrl
        }
      })
    })()
  }, []);


  const columns = [
    {
      title: "用户",
      dataIndex: "user.user_name_display"
    },
    {
      title: "城市",
      dataIndex: "city_name"
    },
    {
      title: "标题",
      dataIndex: "title"
    },
    {
      title: "类别",
      dataIndex: "category_name"
    },
    {
      title: "等级",
      dataIndex: "level"
    },
    {
      title: "创建时间",
      dataIndex: "created_at"
    },
    {
      title: "操作",
      dataIndex: "operator",
      render: () => (
        <a href="#">查看</a>
      )
    }
  ];

  const { statisticsGraphUrl } = state;
  return (
    <Fragment>
      <Collapse style={{ border: 'none', marginBottom: '20px' }}>
        <Panel
          key="1"
          header="文章统计 - 阿里云实施列表"
          style={{ fontWeight: 500, fontSize: '1.17em' }}
        >
          <iframe
            style={{ width: '100%', height: 500, border: 'none' }}
            src={statisticsGraphUrl}
            allow="fullscreen"
          />
        </Panel>
      </Collapse>
      <Card title="主题列表">
        <Table
          rowKey="id"
          columns={ columns }
          pagination={{
            curren: 1,
            pageSize: 20,
            total: 127733
          }}
          { ...tableProps }
        />
      </Card>
    </Fragment>
  )
}
