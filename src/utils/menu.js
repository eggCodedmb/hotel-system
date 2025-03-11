/**
 * 递归生成菜单
 * @param {Array} routes - 路由表
 * @returns {Array} menuItems - 处理后的菜单数据
 */
function getMenus(routes) {
  return routes
    .filter((route) => !route.meta?.hidden) // 过滤掉隐藏菜单
    .map((route) => {
      const menu = {
        path: route.path,
        title: route.meta?.title || "未命名",
        icon: route.meta?.icon || "el-icon-menu",
        children: route.children ? getMenus(route.children) : [], // 递归处理子菜单
      };
      return menu;
    });
}

/**
 * 生成菜单
 * @returns {Array} 处理后的菜单数据
 */
export function generateMenu(router) {
  return getMenus(router);
}

// 普通用户路由
// 在路由文件中添加路由过滤方法
export function filterNonAdminRoutes(routes) {
  return routes.reduce((acc, route) => {
    // 创建路由副本避免修改原始配置
    const clonedRoute = { ...route };

    // 排除管理员专属路由
    if (clonedRoute.meta?.isAdmin === true) return acc;

    // 递归处理子路由
    if (clonedRoute.children) {
      const filteredChildren = filterNonAdminRoutes(clonedRoute.children);

      // 过滤后子路由为空时处理逻辑
      if (filteredChildren.length === 0) {
        // 没有有效子路由且自身无组件时排除父路由
        if (!clonedRoute.component) return acc;
        // 保留有独立组件的父路由
        delete clonedRoute.children;
      } else {
        clonedRoute.children = filteredChildren;
      }
    }

    acc.push(clonedRoute);
    return acc;
  }, []);
}
