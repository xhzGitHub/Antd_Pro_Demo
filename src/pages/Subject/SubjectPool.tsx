import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Breadcrumb
} from 'antd';
import { getSubjectPool } from '@/services/subject';
import { RouterChildProps } from "@/types/router";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 }
}

function SubjectPool() {
  // const [subjectInfo, setSubjectInfo] = useState(null);

  return (
    <Card title={
      <Breadcrumb></Breadcrumb>
    }>
      <Form { ...formItemLayout }>
        <Form.Item label="模块名称">
          <Input placeholder="输入板块名称" />
        </Form.Item>
        <Form.Item label="控制范围">
          <span>0</span>
        </Form.Item>
        <Form.Item label="博主库">   
          <span>0</span>
        </Form.Item>
        <Form.Item label="推荐库">  
          <span>0</span>
        </Form.Item>
        <Form.Item label="文章库">  
          <span>0</span>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
          >
              保存
          </Button>
          <Button type="primary">取消</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
export default Form.create()(SubjectPool)

