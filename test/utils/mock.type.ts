export type MockType<T> = {
  [P in keyof T]?: unknown;
};
