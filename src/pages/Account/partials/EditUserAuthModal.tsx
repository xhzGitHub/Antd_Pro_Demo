import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Checkbox
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import {
  getPermissions,
  getAdminPermissions,
  postAdminPermissions,
  createAdmin
} from '@/services/user';
import { AdminContext } from '../PermissionUserList';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function EditUserAuthModal(props: FormComponentProps) {
  const {
    state: { admin, isCreate, isShowModal },
    dispatch
  } = useContext(AdminContext);

  const [permissions, setPermissions] = useState<Auth.AllPermissions>([]);
  const [adminPermissions, setAdminPermissions] = useState<Auth.AdminPermissions>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    getFieldDecorator,
    setFieldsValue,
    validateFields
  } = props.form;
  
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
      if (!isCreate) {
        (async () => {
          const res = await getAdminPermissions(admin.id);
          if (res && res.data) {
            const adminPermissions = res.data.map(a => a.id);
            setAdminPermissions(adminPermissions);
          }
        })();
      } else {
        setAdminPermissions([]);
      }
    }
  }, [isShowModal]);

  const handleSubmit = useCallback(
    () => {
      setIsSubmitting(true);
      validateFields(async (errors, value) => {
        if (errors) return;
        const payload = {
          ...value,
          permission: adminPermissions
        };

        let response;
        if (isCreate) {
          response = await createAdmin(payload);
        } else {
          response = await postAdminPermissions(payload);
        }
        setIsSubmitting(false);
        
        if (response && response.errcode === 0) {
          dispatch({
            type: 'HIDE_MODAL'
          });
        }
      })
    }, [admin.name, adminPermissions]
  )

  console.log('admin', admin);

  return (
    <div>
      <Modal
        title="编辑管理员"
        visible={ isShowModal }
        onCancel={ () => dispatch({
          type: 'HIDE_MODAL'
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
                onChange={ e => setFieldsValue({
                  user_id: e.target.value
                }) }
                disabled={ Boolean(admin.id) }
              />
            )}
          </Form.Item>
          <Form.Item label="用户名">
            {getFieldDecorator('user_real_name', {
              initialValue: admin.name,
              rules: [{ required: true, message: '用户名为必填项 !' }]
            })(
              <Input
                onChange={ e => setFieldsValue({
                  user_real_name: e.target.value
                }) }
              />
            )}
          </Form.Item>
          <Form.Item label="邮箱">
            {getFieldDecorator('user_email', {
              initialValue: admin.email,
              rules: [{ required: true, message: '邮箱为必填项 !' }]
            })(
              <Input
                onChange={ e => setFieldsValue({
                  user_email: e.target.value
                }) }
                disabled={ Boolean(admin.email) }
              />
            )}
          </Form.Item>
          <Form.Item label="权限">
            <Checkbox.Group
              options={ permissions }
              value={ adminPermissions }
              onChange={ val => setAdminPermissions(val) }
            />
          </Form.Item>
          <Form.Item wrapperCol={{offset: 6}}>
            <Button
              type="primary"
              disabled={ isSubmitting }
              onClick={ handleSubmit }
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
