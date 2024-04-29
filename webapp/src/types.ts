export interface DatasetStatus {
  to_add: string[];
  loading: string[];
  cached: string[];
  all: string[];
}
export interface AllTests {
  [key: string]: string;
}
declare module "bun" {
  interface Env {
    APP_CHECK_KEY: string | boolean;
  }
  interface ProcessEnv {
    APP_CHECK_KEY: string | boolean;
  }
}

namespace NodeJS {
  interface ProcessEnv {
    APP_CHECK_KEY: string | boolean;
  }
}
