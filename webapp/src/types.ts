export interface DatasetStatus {
    to_add: string[];
    loading: string[];
    cached: string[];
    all: string[];
}
export interface AllTests {
    [key: string]: string;
 }