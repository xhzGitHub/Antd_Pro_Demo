import request from '@/utils/request'

export default function testing() {
  return 'testing is successful'
}

export function getSchemas() {
  return request(`/api/data/schemas`);
}