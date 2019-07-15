import React, { useState } from 'react';
import { Form, Input, Button, InputNumber, message } from 'antd';
import { rewardPointToUser } from '@/services/user';
import { FormComponentProps } from 'antd/lib/form';

interface Props extends FormComponentProps {
  pointMode: string;
  id: string;
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function RewardUserPointForm(props: Props) {
  const { getFieldDecorator, validateFields } = props.form;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { pointMode, id } = props;

  const fetchData = async (service, query) => {
    try {
      const response = await service(query);
      setIsSubmitting(false);
      return response;
    } catch (error) {
      setIsSubmitting(false);
      console.log('fetch data fail: ', error);
    }
    return null;
  };

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, value) => {
      if (err) {
        message.error('请填写正确的表格选项！');
        return;
      }
      const payload = {
        ...value,
        amount: pointMode === 'increase' ? value.amount : -value.amount,
      };
      setIsSubmitting(true);
      fetchData(rewardPointToUser, {
        user_id: id,
        payload,
      });
    });
  };

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item label={`数量 (${pointMode === 'increase' ? '+' : '-'})`} wrapperCol={{ span: 8 }}>
        {getFieldDecorator('amount', {
          rules: [{ required: true, message: '数量为必填项 !' }],
        })(<InputNumber placeholder="请输入金币数量" min={1} />)}
      </Form.Item>
      {pointMode === 'increase' && (
        <Form.Item label="原因">
          {getFieldDecorator('reason', {
            rules: [{ required: true, message: '原因为必填项 !' }],
          })(<Input placeholder="请输入原因" />)}
        </Form.Item>
      )}
      <Form.Item wrapperCol={{ offset: 6 }}>
        <Button type="primary" htmlType="submit" disabled={isSubmitting} loading={isSubmitting}>
          {pointMode === 'increase' ? '赠金币' : '扣金币'}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create()(RewardUserPointForm);
