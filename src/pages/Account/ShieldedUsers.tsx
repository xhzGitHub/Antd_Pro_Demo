import React, { useState, useEffect, useReducer } from 'react';
import { 
	Card,
	Form,
	Radio,
	Input,
	Select,
	Spin,
	Button,
	message
} from 'antd';
import {
	getSheildTypes,
	getSheildUserList,
	setSheildUser
} from '@/services/user';
import { debounce } from 'lodash';

interface SheildType {
	id: number;
	name: string;
}

const { Option } = Select;

const formItemLayout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 8 }
};

const initialState = {
	sheildMode: 'SEARCH',
	sheildTypes: [] as Array<SheildType>,
	isSubmitting: false,
	formData: {
		function_id: undefined,
		user_id: undefined
	}
};

const reducer = (state, action) => {
	switch(action.type) {
		case 'INIT':
			return { 
				...state,
				sheildTypes: action.payload
			};
		case 'SWITCH_SHIELD_MODE':
			return {
				...state,
				sheildMode: action.payload 
			};
		case 'UPDATE_FORM_DATA':
			return { 
				...state,
				formData: {
					...state.formData,
					...action.payload
				}
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
			return newState;
		}
		default:
			return state;
	}
};

function ShieldedUsers() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { sheildMode, sheildTypes, isSubmitting, formData } = state;

	useEffect(() => {
		(async () => {
			const sheildTypes = await getSheildTypes();
			dispatch({ type: 'INIT', payload: sheildTypes });
		})();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch({ type: 'SUBMIT', isSubmitting: true });
		const res = await setSheildUser(formData);
		if (res.errcode === 0) {
			dispatch({ type: 'SUBMIT', isSubmitting: false, reset: true });
		} else {
			dispatch({ type: 'SUBMIT', isSubmitting: false });
		}
	};

	return (
		<Card title="新增屏蔽用户">
			<Form  { ...formItemLayout } onSubmit={ handleSubmit }>
				<Form.Item label="用户ID">
					<Radio.Group
						value={ sheildMode }
						onChange={ e => dispatch({
							type: 'SWITCH_SHIELD_MODE',
							payload: e.target.value
						}) }
					>
						<Radio value="SEARCH">搜索框</Radio>
						<Radio value="INPUT">输入框</Radio>
					</Radio.Group>
					{sheildMode === 'SEARCH' && (
						<UserList
							value={ formData.user_id }
							onChange={ user_id => dispatch({
								type: 'UPDATE_FORM_DATA',
								payload: { user_id }
							}) }
						/>
					)}
					{sheildMode === 'INPUT' && (
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
					<SheildTypeSelector
						value={ formData.function_id }
						sheildTypes={ sheildTypes }
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
						loading={isSubmitting}
					>
						提交
					</Button>
				</Form.Item>
			</Form>
		</Card>
	)
};

export default Form.create()(ShieldedUsers);

function UserList({ value, onChange }) {
	const [userList, setUserList] = useState<Array<any>>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSearchUser = async (val) => {
		const query = { search: val };
		if (query.search) {
			setIsLoading(true);
			const res = await getSheildUserList(query);
			setUserList(res.data);
			setIsLoading(false);
		}
	};

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

function SheildTypeSelector({ value, sheildTypes, onChange }) {
	return (
		<Select
			value={ value }
			onChange={ onChange }
		>
			{sheildTypes.map(type => (
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
