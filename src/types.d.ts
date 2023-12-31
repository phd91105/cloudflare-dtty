declare module '*.html' {
  const value: string;
  export default value;
}

declare module '__STATIC_CONTENT_MANIFEST' {
  const value: string;
  export default value;
}

declare type KV = {
  [key: string]: KVNamespace;
};

declare type D1 = {
  [key: string]: D1Database;
};

declare type Env = { [key: string]: string };

declare type Worker = {
  env: Env;
  context: ExecutionContext;
};

declare type obj = {
  [key: string]: any;
};
