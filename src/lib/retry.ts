export const retryAsync = async <TResult>(
  func: () => Promise<TResult>,
  attempts?: number,
  backoff?: number
): Promise<TResult> => {
  let count = 0
  attempts ??= 3
  backoff ??= 1000
  while (count < attempts) {
    try {
      return await func()
    } catch (e) {
      console.error(`retry ${count + 1} failed. ${e}. retrying in ${backoff}ms.`)
      count++
      backoff *= 2
      await new Promise(resolve => setTimeout(resolve, backoff))
    }
  }
  throw new Error('retry failed')
}
