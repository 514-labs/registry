import Ajv from 'ajv'
import addFormats from 'ajv-formats'

export function makeAjv() {
  const ajv = new Ajv({ strict: false, validateFormats: true })
  addFormats(ajv)
  ajv.addFormat('int32', { type: 'number', validate: (n: number) => Number.isInteger(n) })
  ajv.addFormat('double', { type: 'number', validate: (n: number) => Number.isFinite(n) })
  return ajv
}


