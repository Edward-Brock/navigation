import request from '@/utils/request'

export const getAllData = () => {
  return request.get('/site/getAllData');
}

export const findOne = (params: any) => {
  return request.get('/site/' + params)
}