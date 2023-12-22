declare module '*.html' {
  const value: string;
  export default value;
}

declare type KV = {
  [key: string]: KVNamespace & {
    put: (key: string, value: AnyObject) => Promise<string | AnyObject>;
  };
};

declare type Env = { [key: string]: string };

declare type Worker = {
  env: Env;
  context: ExecutionContext;
};

declare type Object = {
  [key: string]: any;
};

declare type AnyObject = Object | Object[];
