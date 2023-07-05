import request from '@/utils/request.ts'

export const getTotalNum = () => {
  return request.get('/site/getTotalNum');
}