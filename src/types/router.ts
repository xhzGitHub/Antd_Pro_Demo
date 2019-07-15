export type RouterChildProps<T = object> = Pick<
  RouteComponentProps<any>,
  Exclude<keyof RouteComponentProps<any>, 'staticContext' | 'location'>
> & {
  location: Location<T>;
};
