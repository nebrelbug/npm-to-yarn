export function parse(command: string) {
  const args: string[] = []
  let lastQuote: string | false = false
  let escaped = false
  let part = ''
  for (let i = 0; i < command.length; ++i) {
    const char = command.charAt(i)
    if (char === '\\') {
      part += char
      escaped = true
    } else {
      if (char === ' ' && !lastQuote) {
        args.push(part)
        part = ''
      } else if (!escaped && (char === '"' || char === "'")) {
        part += char
        if (char === lastQuote) {
          lastQuote = false
        } else if (!lastQuote) {
          lastQuote = char
        }
      } else {
        part += char
      }
      escaped = false
    }
  }
  args.push(part)
  return args
}
