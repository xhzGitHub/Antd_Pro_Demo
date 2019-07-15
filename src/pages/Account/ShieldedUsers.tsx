import React, { useState, useEffect } from 'react';
import { 
	Card,
	Form,
	Radio,
	Input,
	Select,
	Button
} from 'antd';
import { getSheildTypes } from '@/services/user'; 

interface SheildType {
	id: number;
	name: string;
}

const { Option } = Select;

const formItemLayout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 8 }
}

export default function ShieldedUsers() {
	const [sheildMode, setSheildMode] = useState('search');
	const [sheildTypes, setSheildTypes] = useState<Array<SheildType>>([]);

	useEffect(() => {
		(async () => {
			const res = await getSheildTypes();
			setSheildTypes(res);
		})();
	}, [])

	return (
		<Card title="新增屏蔽用户">
			<Form  { ...formItemLayout }>
				<Form.Item label="用户ID">
					<Radio.Group
						value={sheildMode}
						onChange={ e => setSheildMode(e.target.value) }
					>
						<Radio value="search">搜索框</Radio>
						<Radio value="input">输入框</Radio>
					</Radio.Group>
					{sheildMode === 'search' && (
						<Input placeholder="输入用户名或用户ID以搜索" />
					)}
					{sheildMode === 'input' && (
						<Input placeholder="输入用户ID" />
					)}
				</Form.Item>
				<Form.Item label="屏蔽类型">
					<Select>
						{sheildTypes.map(type => (
							<Option
								value={type.id}
								key={type.id}
							>
								{ type.name }
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 4 }}>
					<Button
						type="primary"
						html-type="submit"
					>
						提交
					</Button>
				</Form.Item>
			</Form>
		</Card>
	)
}
