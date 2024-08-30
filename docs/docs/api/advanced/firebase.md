---
sidebar_position: 3
---

# Firebase Resources

## Firestore Data Structure

Firestore is our primary database! For the API, the only data that really matters is the `annotations` document.

Here's the database structure:

```
/
|
+ - general/
  |
  + - articles
    |
    + gse (list of GSE articles)
    |
    + test (list of test articles)
  |
  + - tests
    | 
    + default (default test id of type string)
    |
    + visible (list of test object. Each object includes the test id, test name, test_article, and gse_article)
|
+ - {test_id}/
  |
  + - general
    | 
    + azure_datasets (list of dataset IDs found in azure database)
    |
    + ending_timestamp (int of ms since epoch)
    |
    + starting_timestamp (int of ms since epoch)
    |
    + id (test id of type string)
    |
    + name (test name of type string)
    |
    + test_article (test aricle of type string)
    |
    + gse_article (GSE article of type string)
  | 
  + - annotations
    |
    + {annotation_id} (int of ms since epoch)


```


## Firebase Hosting

Both the main admin dashboard and the data viewer itself are hosted on Firebase with no active routing or middleware, other than a lack of a 404 page (configured as a single-page app).

