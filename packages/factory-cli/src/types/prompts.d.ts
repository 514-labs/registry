declare module 'prompts' {
  export interface PromptObject {
    [key: string]: any
  }

  export type Prompt = PromptObject | PromptObject[]

  function prompts(questions: Prompt, options?: any): Promise<any>
  export default prompts
}


