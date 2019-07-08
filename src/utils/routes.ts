import router from 'umi/router';
import Routes from '../../config/router.config';

const routes = Routes.slice();

const result = [];

function flattenRoutes(routes: any[]) {
  routes.forEach(route => {
    if (route.id) {
      result.push(getRoute(route));
    }
    if (route.routes) {
      flattenRoutes(route.routes);
    }
  });
}

function getRoute(route: any) {
  if (route.id) {
    return {
      id: route.id,
      getPath: (id?: number | string) => {
        if (id) {
          return route.path.replace(/\:id/g, id);
        } else {
          return route.path;
        }
      },
    };
  } else {
    return null;
  }
}

flattenRoutes(routes);

export function navigateTo(routeId: string, idParam?: number | string, state?: any): void {
  const route = result.find(val => val.id === routeId);
  if (!route) {
    throw Error('找不到指定id对应的路由！');
  }
  const path = route.getPath(idParam);
  if (state) {
    router.push({ pathname: path, state });
  } else {
    router.push(path);
  }
}

/**
 * import Link from "umi/link";
 * 注意：此函数需配合Link组件使用！
 */
export function getUrl(routeId, idParam?: number | string): string {
  const route = result.find(val => val.id === routeId);
  if (!route) {
    throw Error('找不到指定id对应的路由！');
  }
  return route.getPath(idParam);
}
