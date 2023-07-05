import request from '@/utils/request'

export const getCategoryInfo = () => {
  return request.get('/category');
}