import { parse } from '../src/command'

describe('should parse command correctly', () => {
  it('simple', () => {
    expect(parse('npm')).toEqual(['npm'])
    expect(parse('npm test')).toEqual(['npm', 'test'])
    expect(parse('npm test bar')).toEqual(['npm', 'test', 'bar'])
  })
  it('with params', () => {
    expect(parse('npm --bar')).toEqual(['npm', '--bar'])
    expect(parse('npm -- --bar')).toEqual(['npm', '--', '--bar'])
  })
  it('with strings', () => {
    expect(parse('npm ""')).toEqual(['npm', '""'])
    expect(parse('npm "test"')).toEqual(['npm', '"test"'])
    expect(parse("npm ''")).toEqual(['npm', "''"])
    expect(parse("npm 'test'")).toEqual(['npm', "'test'"])
  })
  it('with string params', () => {
    expect(parse('npm --bar ""')).toEqual(['npm', '--bar', '""'])
    expect(parse('npm --bar "test"')).toEqual(['npm', '--bar', '"test"'])
    expect(parse("npm --bar ''")).toEqual(['npm', '--bar', "''"])
    expect(parse("npm --bar 'test'")).toEqual(['npm', '--bar', "'test'"])
    expect(parse('yarn add test --no-lockfile')).toEqual(['yarn', 'add', 'test', '--no-lockfile'])
  })
  it('with space in strings', () => {
    expect(parse('npm --bar "test 123"')).toEqual(['npm', '--bar', '"test 123"'])
    expect(parse("npm --bar 'test 123'")).toEqual(['npm', '--bar', "'test 123'"])
    expect(parse('npm --bar "test \' 123"')).toEqual(['npm', '--bar', '"test \' 123"'])
    expect(parse('npm --bar "test \\" 123"')).toEqual(['npm', '--bar', '"test \\" 123"'])
    expect(parse("npm --bar 'test \" 123'")).toEqual(['npm', '--bar', "'test \" 123'"])
    expect(parse("npm --bar 'test \\' 123'")).toEqual(['npm', '--bar', "'test \\' 123'"])
    expect(parse("npm 'test \\' 123 --bar'")).toEqual(['npm', "'test \\' 123 --bar'"])
    expect(parse('npm "test \\" 123 --bar"')).toEqual(['npm', '"test \\" 123 --bar"'])
    expect(parse('npm "a \\" 11" "b \\" 22"')).toEqual(['npm', '"a \\" 11"', '"b \\" 22"'])
  })
})
