export const retryAsync = async <TResult>(func: () => Promise<TResult>, attempts?: number): Promise<TResult> => {
  let count = 0
  attempts ??= 3
  while (count < attempts) {
    try {
      return await func()
    } catch (e) {
      console.error(`retry ${count + 1} failed. ${e}`)
      count++
    }
  }
  throw new Error('retry failed')
}
