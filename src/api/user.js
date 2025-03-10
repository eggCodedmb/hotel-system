import request from "@/utils/request";

// 增加员工 /employeeManagerment/addEmployee
export function addEmployee(params) {
  return request.put({
    url: "/employeeManagerment/addEmployee",
    data: params
  });
}

