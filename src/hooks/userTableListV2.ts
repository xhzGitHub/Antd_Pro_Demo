import { useReducer, useEffect, useCallback, useMemo } from 'react';

interface UseTableListOptions<T> {
	service: (query?: object) => Promise<API.ExtendedResponse<T[]>>;
}

function reducer(state, action) {
	switch(action.type) {
		case "START_FETCHING_DATA":
			return { ...state, loading: true };
		case "FINISH_FETCHING_DATA":
			const newState = {
				...state,
				loading: false,
				dataSource: action.response.data || []
			};
			return newState;
		default:
			return state;
	}
}

export default function useTableListV2<T =any>(options: UseTableListOptions<T>) {
	const initState = {
		loading: true,
		dataSource: [],
		filters: {}
	}
	const [state, dispatch] = useReducer(reducer, initState);

	useEffect(() => {
		if (state.loading) {
			fetchData();
		}
	}, []);

	async function fetchData() {
    // const query = yieldQueryFromState();
		const response = await options.service();
		dispatch({
			type: "FINISH_FETCHING_DATA",
			response
		});
	};
	
	return {
		tableProps: {
			loading: state.loading,
			dataSource: state.dataSource
		},
		// getCo
	}
}