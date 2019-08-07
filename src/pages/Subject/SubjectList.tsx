import React, { Fragment, useState, useReducer, useContext, useEffect, useCallback } from "react";
import {
  Collapse,
  Card,
  Table,
  Checkbox,
  Input,
  Select,
  Button,
  Icon,
  Statistic,
  Popover,
  Row,
  Col,
  Switch
} from "antd";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import useTableList from "@/hooks/useTableList";
import {
  getStatisticGraph,
  getSubjectList,
  getSubjectCategories,
  getNationalCommunities,
  getReviewStats,
  setNationalCommunities
} from "@/services/subject";
import { SUBJECT_LEVEL } from "./constants";

interface State {
  statisticsGraphUrl: string;
  categories: Subject.Categories;
  communityCategories: Subject.NationalCategories;
  nationalCategoryFilters: Subject.Categories;
  reviewStats: Subject.ReviewStats<number>;
  isShowPopover: boolean;
}

interface Context {
  state: State;
  dispatch: (action: Action) => void;
}

const { Panel } = Collapse;
const { Search } = Input;
const { Option } = Select;

const initialState = {
  statisticsGraphUrl: "",
  categories: [],
  communityCategories: [],
  nationalCategoryFilters: [],
  reviewStats: {},
  isShowPopover: false
} as State;

type Action =
  | {
      type: "INIT";
      payload: Pick<
        State,
        "categories" | "communityCategories" | "statisticsGraphUrl" | "reviewStats"
      >;
    }
  | { type: "SET_STATE"; payload: Partial<State> };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        ...action.payload
      };
    case "SET_STATE":
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

const nationalCategoryContext = React.createContext({} as Context);

export default function SubjectList() {
  useDocumentTitle("主题列表");
  const { tableProps, setFilters, getFilter } = useTableList({
    fetchData: getSubjectList
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const statisticsGraphUrl = await getStatisticGraph();
      const categories = await getSubjectCategories();
      const communityCategories = await getNationalCommunities();
      const reviewStats = await getReviewStats();

      dispatch({
        type: "INIT",
        payload: {
          statisticsGraphUrl,
          categories,
          communityCategories,
          reviewStats
        }
      });
    })();
  }, []);

  const {
    statisticsGraphUrl,
    categories,
    communityCategories,
    nationalCategoryFilters,
    reviewStats,
    isShowPopover
  } = state;

  const columns = [
    {
      title: "用户",
      key: "user",
      dataIndex: "user.user_name_display"
    },
    {
      title: "城市",
      key: "city_name",
      dataIndex: "city_name"
    },
    {
      title: "标题",
      key: "title",
      dataIndex: "title"
    },
    {
      title: "类别",
      key: "category_id",
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
      render: () => <a href="#">查看</a>
    }
  ];

  const extraContent = (
    <Fragment>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px"
        }}
      >
        <Checkbox
          value={getFilter("isTop")}
          onChange={e => {
            setFilters({ isTop: e.target.checked ? 1 : 0 });
          }}
        >
          置顶
        </Checkbox>
        <Checkbox
          value={getFilter("is_featured")}
          onChange={e => {
            setFilters({ is_featured: e.target.checked ? 1 : 0 });
          }}
        >
          推荐
        </Checkbox>
        <Checkbox
          value={getFilter("official_bookmark")}
          onChange={e => {
            setFilters({ official_bookmark: e.target.checked ? 1 : 0 });
          }}
        >
          收录
        </Checkbox>
        <Search placeholder="搜 标题、内容、用户ID" style={{ width: "200px" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Select
          placeholder="全国圈子"
          mode="multiple"
          style={{ width: "120px" }}
          onChange={(val: State["nationalCategoryFilters"]) => {
            dispatch({
              type: "SET_STATE",
              payload: { nationalCategoryFilters: val }
            });
          }}
        >
          {communityCategories.map(c => (
            <Option key={c.id}>{c.content}</Option>
          ))}
        </Select>
        <Button
          style={{ marginLeft: "5px" }}
          onClick={() => {
            setFilters({ national_category_ids: nationalCategoryFilters });
          }}
        >
          <Icon type="check" />
        </Button>
        <Button style={{ marginLeft: "5px" }}>
          <Icon type="close" />
        </Button>
        <Popover
          visible={isShowPopover}
          content={
            <nationalCategoryContext.Provider value={{ state, dispatch }}>
              <NationalCategoriesForm />
            </nationalCategoryContext.Provider>
          }
        >
          <Button
            style={{ width: "170px", marginLeft: "5px" }}
            onClick={() =>
              dispatch({
                type: "SET_STATE",
                payload: { isShowPopover: true }
              })
            }
          >
            <Icon type="setting" />
            设置是否显示
          </Button>
        </Popover>
      </div>
    </Fragment>
  );

  const tableTitle = useCallback(() => {
    return (
      <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
        <Statistic title="今日未分类文章数" value={reviewStats.today} />
        <Statistic title="昨日未分类文章数" value={reviewStats.yesterday} />
        <Statistic title="所有未分类文章数" value={reviewStats.all} />
      </div>
    );
  }, [reviewStats]);

  return (
    <Fragment>
      <Collapse style={{ border: "none", margin: "40px 0" }}>
        <Panel
          key="1"
          header="文章统计 - 阿里云实施列表"
          style={{ fontWeight: 500, fontSize: "1.17em" }}
        >
          <iframe
            style={{ width: "100%", height: 500, border: "none" }}
            src={statisticsGraphUrl}
            allow="fullscreen"
          />
        </Panel>
      </Collapse>
      <Card title="主题列表" extra={extraContent}>
        <Table title={tableTitle} rowKey="alias" columns={columns} {...tableProps} />
      </Card>
    </Fragment>
  );
}

function getFiltersFromEnum(enumObj) {
  const filter = [];
  for (const key in enumObj) {
    if (typeof enumObj[key] === "number") {
      filter.push({
        text: key,
        value: enumObj[key]
      });
    }
  }
  return filter;
}

function NationalCategoriesForm() {
  const { state, dispatch } = useContext(nationalCategoryContext);
  const [formData, setFormData] = useState<Subject.NationalCategories>(state.communityCategories);

  return (
    <div>
      <Card
        bordered={false}
        title={
          <div>
            <Icon type="setting" />
            &nbsp;对以下标签进行操作，可决定改标签的文章是否在APP上显示
          </div>
        }
      >
        <Row style={{ textAlign: "center" }}>
          <Col span={8}>序号</Col>
          <Col span={8}>标签</Col>
          <Col span={8}>操作</Col>
        </Row>
        {formData.map((n, index) => (
          <Row key={n.id} style={{ textAlign: "center", margin: "10px 0" }} gutter={24}>
            <Col span={8}>{index}</Col>
            <Col span={8}>{n.content}</Col>
            <Col span={8}>
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                checked={Boolean(n.is_show)}
                onChange={checked => {
                  setFormData(
                    formData.map(item =>
                      item.id === n.id
                        ? ({ ...item, is_show: checked ? 1 : 0 } as Subject.NationalCategory)
                        : item
                    )
                  );
                }}
              />
            </Col>
          </Row>
        ))}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            type="primary"
            style={{ marginRight: "10px" }}
            onClick={async () => {
              const res = await setNationalCommunities(formData);
              if (res.errcode === 0) {
                dispatch({
                  type: "SET_STATE",
                  payload: {
                    isShowPopover: false,
                    communityCategories: formData
                  }
                });
              }
            }}
          >
            确认
          </Button>
          <Button
            onClick={() => {
              dispatch({
                type: "SET_STATE",
                payload: { isShowPopover: false }
              });
            }}
          >
            取消
          </Button>
        </div>
      </Card>
    </div>
  );
}
