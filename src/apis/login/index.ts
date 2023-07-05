import request from '@/utils/request'

export const getPassword = (params: string) => {
  return request.get('/option/getPassword/' + params);
}