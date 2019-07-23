import React, { useReducer, useEffect, useCallback, Fragment } from "react";
import { Card, Form, Input, Upload, Icon, Button, Skeleton } from "antd";
import { IntlProvider } from "react-intl";
import { RouterChildProps } from "@/types/router";
import { getSubjectRegionDetail } from "@/services/subject";
import { debounce } from "lodash";

interface Region {
  name: string;
  image: string;
  description: string;
}

interface State {
  formData: Region;
  isLoading: boolean;
}

type Action =
  | { type: "INIT"; formData: Region; isLoading: boolean }
  | { type: "SET_REGION_NAME"; name: Region["name"] }
  | { type: "SET_DISPLAY_IMAGE"; image: Region["image"] }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.formData
        },
        isLoading: action.isLoading
      };
    case "SET_REGION_NAME":
      return {
        ...state,
        formData: {
          ...state.formData,
          name: action.name
        }
      };
    case "SET_DISPLAY_IMAGE":
      return {
        ...state,
        formData: {
          ...state.formData,
          image: action.image
        }
      }
  }
};

const { Dragger } = Upload;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

const initialState = {
  formData: {
    name: "",
    image: "",
    description: ""
  } as Region,
  isLoading: false
};

function SubjectRegion(props: RouterChildProps) {
  const regionId = props.match.params.id;
  const isCreating = regionId === undefined;
  const [state, dispatch] = useReducer(reducer, initialState, state =>
    isCreating ? state : { ...state, isLoading: true }
  );

  useEffect(() => {
    if (!isCreating) {
      (async () => {
        const res = await getSubjectRegionDetail(regionId);
        if (Object.keys(res).length) {
          const { name, image, description } = res;
          const formData = {
            name,
            image,
            description
          };
          dispatch({ type: "INIT", formData, isLoading: false });
        }
      })();
    }
  }, []);

  // useCallback 可再考虑一下！
  const handleSetRegionName = useCallback(
    debounce(val => {
      dispatch({
        type: "SET_REGION_NAME",
        name: val
      });
    }, 500),
    [state]
  );

  const handleSetRegionImage = ({ file }) => {
    if (file.status === 'done') {
      const image = file.response.data.url;
      dispatch({
        type: "SET_DISPLAY_IMAGE",
        image
      });
    }
  };

  console.log('state', state);

  const { name, image, description } = state.formData;

  return (
    <IntlProvider>
      <Card title="热门商圈">
        {state.isLoading ? (
          <Skeleton active loading={state.isLoading} />
        ) : (
          <Form {...formItemLayout}>
            <Form.Item label="商圈名称">
              {isCreating ? (
                <Input
                  placeholder="输入商圈名称"
                  onChange={e => {
                    handleSetRegionName(e.target.value);
                  }}
                />
              ) : (
                <span>{name}</span>
              )}
            </Form.Item>
            <Form.Item label="展示图片">
              {!image ?
              (
                <Dragger
                  multiple={true}
                  showUploadList={false}
                  withCredentials
                  action={`https://admin.beta.jojotu.cn/api/assets`}
                  onChange={handleSetRegionImage}
                >
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-hint">单击或拖拽以上传图片</p>
                </Dragger>
              ) : (
                <Card
                  cover={<img src={image} style={{ width: "300px", height: "300px" }} />}
                  actions={[
                    <Button type="danger">
                      <Icon type="delete" />
                    </Button>
                  ]}
                />
              )}
              <div>(图片大小300k以内)</div>
            </Form.Item>
            <Form.Item label="展示文案">
              <Input placeholder="最多15个字符，包括标点符号" value={description} />
            </Form.Item>
            {!isCreating && (
              <Fragment>
                <Form.Item label="手动添加关联商店">
                  <Input placeholder="输入商家名称" />
                </Form.Item>
                <Form.Item label="手动移除关联商店">
                  <Input placeholder="输入商家名称" />
                </Form.Item>
              </Fragment>
            )}
            <Form.Item wrapperCol={{ offset: 6 }}>
              <Button type="primary" style={{ marginRight: "10px" }}>
                {isCreating ? "创建" : "保存"}
              </Button>
              <Button type="primary">取消</Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </IntlProvider>
  );
}

export default Form.create()(SubjectRegion);
