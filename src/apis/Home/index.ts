import request from '@/utils/request'

export const getAllData = () => {
  return request.get('/site/getAllData');
}