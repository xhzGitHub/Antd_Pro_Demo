import { useReducer, useEffect, useCallback, useMemo } from 'react';
import qs from 'qs';

interface UseTableListOptions<T> {
	service: (query?: object) => Promise<API.ExtendedResponse<T[]>>;
	defaultQuery?: object;
}

interface QueryState {
	filters: {[key: string]: Array<string | number>}
}

interface State<T> extends QueryState{
	loading: boolean;
	dataSource: T[];
}

type Action<T> = 
	| { type: "START_FETCHING_DATA" }
	| { type: "FINISH_FETCHING_DATA", response: API.ExtendedResponse<T[]> }
	| { type: "CHANGE_QUERY_STATE", payload: Optional<QueryState> }

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
	switch(action.type) {
		case "START_FETCHING_DATA":
			return { ...state, loading: true };
		case "FINISH_FETCHING_DATA":
			const newState: State<T> = {
				...state,
				loading: false,
				dataSource: action.response.data || []
			};
			return newState;
		case "CHANGE_QUERY_STATE":
			return {
				...state,
				...action.payload
			};
		default:
			return state;
	}
}

function buildQuery(queryState: QueryState) {
	for (const [key, value] of Object.entries(queryState.filters)) {
		queryState[key] = value.join(",");
	}
	return queryState;
}

// function buildQueryString(queryState: QueryState) {
// 	return qs.stringify(buildQuery(queryState));
// }

type UseTableListReducer<T> = (state: State<T>, action: Action<T>) => State<T>

export default function useTableListV2<T = any>(options: UseTableListOptions<T>) {
	const initialState:State<T> = {
		loading: true,
		dataSource: [],
		filters: {}
	};

	const [state, dispatch] = useReducer(
		reducer as UseTableListReducer<T>,
		initialState
	);

	const queryState = useMemo(
		() => ({
			filters: state.filters
		}), [state.filters]
	);

	// const queryString = useMemo(
	// 	() => buildQueryString(queryState)
	// , [queryState]);

	console.log('state:', state);

	useEffect(() => {
		fetchData();
	}, [queryState]);

	const fetchData = async () => {
		dispatch({type: "START_FETCHING_DATA"});
		const response = await options.service(
			options.defaultQuery
				? { ...buildQuery(queryState), ...options.defaultQuery }
				: buildQuery(queryState)
		);
		dispatch({
			type: "FINISH_FETCHING_DATA",
			response
		});
	};

	const getFilter = useCallback(field => {
		const target = state.filters[field];
		if (Array.isArray(target)) {
			if (target.length === 0) return undefined;
			if (target.length > 0) return target[0];
		}
		return target
	}, [state.filters]);

	const setFilters = useCallback(
		(field: string, value: string | number | Array<number | string>) => {
			dispatch({
				type: "CHANGE_QUERY_STATE",
				payload: {
					filters: { ...state.filters, [field]: Array.isArray(value) ? value : [value] }
				}
			});
	}, [state.filters]);

	const handleChangeTable = useCallback(
		filters => {
			const resolvedFilters = { ...filters };
			for (const [key, value] of Object.entries(resolvedFilters)) {
				if (Array.isArray(value) && !value.length) {
					delete resolvedFilters[key];
				}
			}
			dispatch({
				type: "CHANGE_QUERY_STATE",
				payload: {
					filters: { ...state.filters, ...resolvedFilters }
				}
			}
			)
		}
	, [])
	
	return {
		tableProps: {
			loading: state.loading,
			dataSource: state.dataSource,
			onChange: handleChangeTable
		},
		getFilter,
		setFilters
		// getCo
	}
}