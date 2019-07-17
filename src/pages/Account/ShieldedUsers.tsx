import React, { useState, useEffect, useReducer, useCallback, Fragment } from 'react';
import { 
	Card,
	Form,
	Radio,
	Input,
	Select,
	Spin,
	Button,
	Table,
	Popconfirm,
	Icon,
} from 'antd';
import {
	getShieldTypes,
	getShieldUserList,
	setShieldUser,
	getShieldedUsers,
	removeShieldedUsers
} from '@/services/user';
import { debounce } from 'lodash';
import { navigateTo } from '@/utils/routes';

const { Option } = Select;

const formItemLayout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 8 }
};

const initialState = {
	shieldMode: 'SEARCH',
	shieldTypes: [] as User.ShieldTypeArray,
	shieldedUsers: [] as User.ShieldedUsersList,
	isSubmitting: false,
	formData: {
		function_id: undefined as User.ShieldFunctionID,
		user_id: undefined as User.UserID
	}
};

type State = typeof initialState;

type Action = 
	| { 
			type: 'INIT';
			payload: {
				shieldTypes: User.ShieldTypeArray,
				shieldedUsers: User.ShieldedUsersList
			};
		}
	| {
			type: 'SWITCH_SHIELD_MODE';
			payload: { shieldMode: string };
		}
	| {
			type: 'UPDATE_FORM_DATA';
			payload: { 
				user_id: User.UserID
			}
		}
	| {
			type: 'UPDATE_FORM_DATA';
			payload: { 
				function_id: User.ShieldFunctionID
			}
		}
	| {
			type: 'UPDATE_SHIELDED_USERS';
			payload: User.ShieldedUsersList;
		}
	| {
			type: 'SUBMIT';
			isSubmitting: boolean;
			reset?: boolean;
			shieldedUsers?: User.ShieldedUsersList;
		}

const reducer = (state: State, action: Action) => {
	switch(action.type) {
		case 'INIT':
			return { 
				...state,
				...action.payload
			};
		case 'SWITCH_SHIELD_MODE':
			return {
				...state,
				shieldMode: action.payload 
			};
		case 'UPDATE_FORM_DATA':
			return { 
				...state,
				formData: {
					...state.formData,
					...action.payload
				}
			};
		case 'UPDATE_SHIELDED_USERS':
			return {
				...state,
				shieldedUsers: action.payload
			};
		case 'SUBMIT': {
			const newState = {
				...state,
				isSubmitting: action.isSubmitting
			};
			if (action.reset) {
				newState.formData = {
					function_id: undefined,
					user_id: undefined
				};
			}
			if (action.shieldedUsers) {
				newState.shieldedUsers = action.shieldedUsers;
			}
			return newState;
		};
		default:
			return state;
	}
};

function ShieldedUsers() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { shieldMode, shieldTypes, shieldedUsers, isSubmitting, formData } = state;

	useEffect(() => {
		(async () => {
			const shieldTypes = await getShieldTypes();
			const shieldedUsers = await getShieldedUsers();
			dispatch({ type: 'INIT', payload: { shieldTypes, shieldedUsers } });
		})();
	}, []);

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			dispatch({ type: 'SUBMIT', isSubmitting: true });
			const res = await setShieldUser(formData);
			if (res.errcode === 0) {
				const shieldedUsers = await getShieldedUsers();
				dispatch({ type: 'SUBMIT', isSubmitting: false, reset: true, shieldedUsers });
			} else {
				dispatch({ type: 'SUBMIT', isSubmitting: false });
			}
		}, [formData]
	);

	const refreshShieldedUsers = useCallback(async () => {
		const shieldedUsers = await getShieldedUsers();
		dispatch({ type: 'UPDATE_SHIELDED_USERS', payload: shieldedUsers });
	}, [shieldedUsers]);

	const handleRemoveUser = useCallback(async (payload) => {
		const res = await removeShieldedUsers(payload);
		if (res.errcode === 0) {
			refreshShieldedUsers();
		}
	}, [shieldedUsers]);


	const columns = [
		{
			title: '屏蔽类型',
			key: 'type',
			dataIndex: 'type'
		},
		{
			title: '已屏蔽用户',
			key: 'users',
			dataIndex: 'users',
			render: (usersArray, record) => (
				<Fragment>
					{usersArray.map(user_id => (
						<Popconfirm
							title="确认要取消屏蔽吗"
							key={ user_id }
							onConfirm={ () => handleRemoveUser({
								user_id,
								function_id: (shieldTypes.find(type =>  type.name === record.type)).id
							}) }
						>
							<div className='ant-tag'>
								<a onClick={ e => {
									e.stopPropagation();
									navigateTo('user-detail', user_id);
								}	}>
									{ user_id }
								</a>
								<Icon type='close' />
							</div>
						</Popconfirm>
					))}
				</Fragment>
			)
		}
	];

	return (
		<Fragment>
			<Card title="新增屏蔽用户" style={{ marginBottom: '20px' }}>
				<Form  { ...formItemLayout } onSubmit={ handleSubmit }>
					<Form.Item label="用户ID">
						<Radio.Group
							value={ shieldMode }
							onChange={ e => dispatch({
								type: 'SWITCH_SHIELD_MODE',
								payload: e.target.value
							}) }
						>
							<Radio value="SEARCH">搜索框</Radio>
							<Radio value="INPUT">输入框</Radio>
						</Radio.Group>
						{shieldMode === 'SEARCH' && (
							<UserListSelector
								value={ formData.user_id }
								onChange={ user_id => dispatch({
									type: 'UPDATE_FORM_DATA',
									payload: { user_id }
								}) }
							/>
						)}
						{shieldMode === 'INPUT' && (
							<Input
								placeholder="输入用户ID"
								value={ formData.user_id }
								onChange={ e => dispatch({ 
									type: 'UPDATE_FORM_DATA',
									payload: { user_id: Number(e.target.value) || undefined }
								}) }
							/>
						)}
					</Form.Item>
					<Form.Item label="屏蔽类型">
						<ShieldTypeSelector
							value={ formData.function_id }
							shieldTypes={ shieldTypes }
							onChange={ function_id => dispatch({
								type: 'UPDATE_FORM_DATA',
								payload: { function_id }
							}) }
						/>
					</Form.Item>
					<Form.Item wrapperCol={{ offset: 4 }}>
						<Button
							type="primary"
							htmlType="submit"
							disabled={ !formData.user_id || !formData.function_id }
							loading={ isSubmitting }
						>
							提交
						</Button>
					</Form.Item>
				</Form>
			</Card>
			<Card title="已屏蔽用户">
				<Table
					columns={ columns }
					dataSource={ shieldedUsers }
					pagination={ false }
				/>
			</Card>
		</Fragment>
	)
};

export default Form.create()(ShieldedUsers);

function UserListSelector({ 
	value,
	onChange
 }: {
	value: User.UserID;
	onChange: (id: User.UserID) => any
}) {
	const [userList, setUserList] = useState<User.List>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSearchUser = useCallback(
		async (search: User.FuzzySearch) => {
			const query = { search };
			if (query.search) {
				setIsLoading(true);
				const res = await getShieldUserList(query);
				setUserList(res.data);
				setIsLoading(false);
			}
		}, []
	);

	return (
		<Select
			showSearch
			placeholder="输入用户名或用户ID以搜索"
			value={ value }
			onChange={ onChange }
			onSearch={ debounce(handleSearchUser, 1000) }
			notFoundContent={ isLoading ? <Spin spinning /> : null }
			loading={ isLoading }
			disabled={ isLoading }
		>
			{userList.map(user => (
				<Option key={ user.id } value={ user.id }>
					{ user.name }
				</Option>
			))}
		</Select>
	);
}

function ShieldTypeSelector({ value, shieldTypes, onChange }: {
	value: User.ShieldFunctionID;
	shieldTypes: User.ShieldTypeArray;
	onChange: (user_id: User.ShieldFunctionID) => any;
}) {
	return (
		<Select
			value={ value }
			onChange={ onChange }
		>
			{shieldTypes.map(type => (
				<Option
					value={ type.id }
					key={ type.id }
				>
					{ type.name }
				</Option>
			))}
		</Select>
	)
}
