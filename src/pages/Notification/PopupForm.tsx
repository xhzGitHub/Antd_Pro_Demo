import React, { Fragment } from "react";
import { Card, Button, Form, Input, Upload, Icon, Switch, Select } from "antd";
import { FormComponentProps, FormItemProps } from "antd/lib/form";
import Enum from "@/utils/Enum";
import { AppPopup } from "@/types/app-popup";

const formItemLayout: Pick<FormItemProps, "labelCol" | "wrapperCol"> = {
  labelCol: { span: 4 },
  wrapperCol: { span: 6 }
};

const NavigateType = new Enum(AppPopup.NavigateType);
const AcceptUserType = new Enum(AppPopup.AcceptUserType);

const uploadButton = (
  <div>
    <Icon type="plus" />
    <div>上传图片</div>
  </div>
);

const PopupForm = (props: FormComponentProps) => {
  const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = props.form;

  getFieldDecorator("navigate", {
    initialValue: { type: null, value: [] }
  });

  return (
    <Card title="开机弹窗">
      <Form>
        <Form.Item label="名称" {...formItemLayout}>
          {getFieldDecorator("title", {
            rules: [{ required: true, message: "名称不能为空" }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="弹窗图片" {...formItemLayout}>
          {getFieldDecorator("picture_url", {
            rules: [{ required: true, message: "弹窗图片不能为空" }]
          })(<div />)}
          <Fragment>
            <Upload
              listType="picture-card"
              action="https://admin.beta.jojotu.cn/api/assets"
              onChange={info => {
                if (info.file.status === "done") {
                  setFieldsValue({
                    picture_url:
                      "https://jojotoo-static.oss-cn-shanghai.aliyuncs.com/upload/photo/npxEznxSX2ifdBGBPRv3xuGL6zt2RQMD1F0wkPud.png"
                  });
                }
              }}
            >
              {uploadButton}
            </Upload>
            <div style={{ fontSize: "12px", color: "#D5D5D5" }}>
              jpg/jpeg/png格式支持，2M以内（点击上传）
            </div>
          </Fragment>
        </Form.Item>
        <Form.Item label="弹窗跳转H5" {...formItemLayout}>
          {getFieldDecorator("jump_h5", {
            initialValue: 0
          })(<div />)}
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            checked={Boolean(getFieldValue("jump_h5"))}
            onChange={checked => {
              setFieldsValue({ jump_h5: checked ? 1 : 0 });
            }}
          />
        </Form.Item>
        <Form.Item label="弹窗跳转内部链接" {...formItemLayout}>
          <Select
            onChange={value =>
              setFieldsValue({
                navigate: { type: value, value: [] }
              })
            }
          >
            {NavigateType.map((key, value) => (
              <Select.Option value={value} key={key}>
                {key}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="弹窗人群" {...formItemLayout}>
          {getFieldDecorator("accept_user_type_description")(
            <Select>
              {AcceptUserType.map((key, value) => (
                <Select.Option key={key} value={value}>
                  {key}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ offset: formItemLayout.labelCol.span }}>
          <Button
            type="primary"
            onClick={() => {
              validateFields((errors, value) => {
                console.log("value: ", value);
              });
            }}
          >
            保存
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Form.create()(PopupForm);
