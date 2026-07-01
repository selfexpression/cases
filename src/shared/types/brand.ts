export type Brand<TName extends string> = string & { readonly __brand: TName }
