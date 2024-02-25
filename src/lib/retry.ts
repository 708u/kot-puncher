export const retryAsync = async <TResult>(
  func: () => Promise<TResult>,
  attempts?: number,
  backoff?: number
): Promise<TResult> => {
  let count = 0
  attempts ??= 4
  backoff ??= 1000
  while (count < attempts) {
    try {
      if (count > 0) {
        console.log(`retry ${count} after ${backoff}ms`)
        await new Promise(resolve => setTimeout(resolve, backoff))
        backoff *= 2
      }
      return await func()
    } catch (e) {
      console.log(`retry ${count + 1} failed. ${e}`)
      count++
    }
  }
  throw new Error('retry failed')
}
