import request from '@/utils/request';

export async function reqInnerApplyForm(params) {
  return request('/project/FunctionCreateCommonApply', {
    method: 'POST',
    data: params,
  });
}

