import request from "@/utils/request";

export async function getInnerProject(data) {
  return request('/project/getFunctionCreateCommonApply', {
    method: 'post',
    data: data
  })
}
