

/**
 * 递归生成菜单
 * @param {Array} routes - 路由表
 * @returns {Array} menuItems - 处理后的菜单数据
 */
function getMenus(routes) {
    return routes
        .filter(route => !route.meta?.hidden) // 过滤掉隐藏菜单
        .map(route => {
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
