import React, { Fragment, useReducer, useEffect } from 'react';
import {
  Collapse,
  Card,
  Table,
  Checkbox,
  Input,
  Select,
  Button,
  Icon
} from 'antd';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useTableList from '@/hooks/useTableList';
import {
  getStatisticGraph,
  getSubjectList,
  getSubjectCategories
} from '@/services/subject';
import { SUBJECT_LEVEL } from './constants';

interface State {
  statisticsGraphUrl: string;
  categories: Subject.categories;
}

type Action =
  | { type: 'INIT'; payload: State };

const { Panel } = Collapse;
const { Search } = Input;
const { Option } = Select;

const initialState = {
  statisticsGraphUrl: '',
  categories: []
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

  useEffect(() => {
    (async () => {
      const statisticsGraphUrl = await getStatisticGraph();
      const categories = await getSubjectCategories();
      
      dispatch({
        type: 'INIT',
        payload: {
          statisticsGraphUrl,
          categories
        }
      })
    })()
  }, []);


  const {
    statisticsGraphUrl,
    categories
  } = state;

  console.log('c', categories);

  const columns = [
    {
      title: "用户",
      key: 'user',
      dataIndex: "user.user_name_display"
    },
    {
      title: "城市",
      key: 'city_name',
      dataIndex: "city_name"
    },
    {
      title: "标题",
      key: 'title',
      dataIndex: "title"
    },
    {
      title: "类别",
      key: 'category_id',
      dataIndex: "category_id",
      filters: categories
    },
    {
      title: "等级",
      key: "level",
      dataIndex: "level",
      filters: getFiltersFromEnum(SUBJECT_LEVEL)
    },
    {
      title: "创建时间",
      key: "created_at",
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

  const extraContent = (
    <Fragment>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <Checkbox.Group
          options={[
            {
              label: '置顶',
              value: 'isTop'
            },
            {
              label: '推荐',
              value: 'is_featured'
            }, 
            {
              label: '收录',
              value: 'official_bookmark'
            }
          ]}
        />
        <Search
          placeholder="搜 标题、内容、用户ID"
          style={{ width: '200px' }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select
          placeholder="全国圈子"
          style={{ width: '120px' }}
        >
          <Option key="1">
            拍摄圣地
          </Option>
        </Select>
        <Button
          style={{ marginLeft: '5px' }}
        >
          <Icon type="check" />
        </Button>
        <Button
          style={{ marginLeft: '5px' }}
        >
          <Icon type="close" />
        </Button>
        <Button
          style={{ width: '170px', marginLeft: '5px' }}
        >
          <Icon type="setting" />
          设置是否显示
        </Button>
      </div>
    </Fragment>
  );

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
      <Card
        title="主题列表"
        extra={extraContent}
      >
        <Table
          rowKey="id"
          columns={ columns }
          { ...tableProps }
        />
      </Card>
    </Fragment>
  )
}

function getFiltersFromEnum(enumObj) {
  const filter = [];
  for (const key in enumObj) {
    if (typeof enumObj[key] === 'number') {
      filter.push({
        text: key,
        value: enumObj[key]
      })
    }
  }
  return filter;
};