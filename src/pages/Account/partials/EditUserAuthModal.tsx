import React, { useContext, useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Checkbox
} from 'antd';
import {
  getPermissions,
  getAdminPermissions,
} from '@/services/user';
import { AdminContext } from '../PermissionUserList';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function EditUserAuthModal(props) {
  const {
    state: { admin, isShowModal },
    dispatch
  } = useContext(AdminContext);

  const [permissions, setPermissions] = useState([]);
  const [adminPermissions, setAdminPermissions] = useState([]);

  const { getFieldDecorator, getFieldValue } = props.form;
  
  useEffect(() => {
    (async () => {
      const res = await getPermissions();
      if (res && res.data) {
        const permissions = res.data.map(p => {
          return {
            label: p.description || p.name,
            value: p.id
          };
        });
        setPermissions(permissions);
      }
    })()
  }, []);

  useEffect(() => {
    if (isShowModal) {
      (async () => {
        const res = await getAdminPermissions(admin.id);
        if (res && res.data) {
          const adminPermissions = res.data.map(a => a.id);
          setAdminPermissions(adminPermissions);
        }
      })();
    }
  }, [isShowModal]);

  const handleSubmit = () => {
    dispatch({
      type: 'HIDE_MODAL',
      isShowModal: false
    })
    console.log('ok');
  };

  console.log('admin', admin);

  return (
    <div>
      <Modal
        title="编辑管理员"
        visible={ isShowModal }
        onCancel={ () => dispatch({
          type: 'HIDE_MODAL',
          isShowModal: false
        }) }
        footer={ null }
      >
        <Form { ...formItemLayout }>
          <Form.Item label="用户ID">
            {getFieldDecorator('user_id', {
              initialValue: admin.id,
              rules: [{ required: true, message: '用户ID为必填项 !' }]
            })(
              <Input
                value={ getFieldValue('user_id') }
                disabled={ Boolean(admin.id) }
              />
            )}
          </Form.Item>
          <Form.Item label="用户名">
            {getFieldDecorator('user_name', {
              initialValue: admin.name,
              rules: [{ required: true, message: '用户名为必填项 !' }]
            })(
              <Input value={ getFieldValue('user_name') } />
            )}
          </Form.Item>
          <Form.Item label="邮箱">
            {getFieldDecorator('user_email', {
              initialValue: admin.email,
              rules: [{ required: true, message: '邮箱为必填项 !' }]
            })(
              <Input
                value={ getFieldValue('user_email') }
                disabled={ Boolean(admin.email) }
              />
            )}
          </Form.Item>
          <Form.Item label="权限">
            <Checkbox.Group
              options={ permissions }
              value={ adminPermissions }
            />
          </Form.Item>
          <Form.Item wrapperCol={{offset: 6}}>
            <Button
              type="primary"
              onClick={handleSubmit}
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Form.create()(EditUserAuthModal);
