export interface TestDetails {
    name: string;
    id: string;
    test_article: string;
    gse_article: string;
    datasets?: string[];
}

export const enum loadingStatus {
    LOADING,
    DONE
  }

  export const enum articleType {
    GSE,
    TEST
  }