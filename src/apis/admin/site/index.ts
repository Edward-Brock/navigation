import request from '@/utils/request'

export const getSiteInfo = () => {
  return request.get('/site');
}