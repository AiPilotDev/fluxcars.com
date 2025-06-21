export function formatError(error: any): string {
  if (error?.response?.data?.errors?.[0]?.message) {
    return error.response.data.errors[0].message;
  }
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'Неизвестная ошибка';
} 