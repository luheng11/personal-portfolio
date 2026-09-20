export const normalizeImageUrl = (url: string): string => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url
  return url.startsWith('/') ? url : `/${url}`
}
