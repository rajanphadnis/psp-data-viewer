from google.cloud import bigquery

job_config = bigquery.QueryJobConfig()
job_config.use_legacy_sql = False
# client.query(query, job_config=job_config)

# Initialize the BigQuery client with your project ID
client = bigquery.Client(project="psp-portfolio-f1205", default_query_job_config=job_config)

# Define your query
query = """
    SELECT
        time,
        data
    FROM
        `psp-portfolio-f1205.test_dataset.pt-ox-02`
"""

# Run the query asynchronously
# dataset = client.dataset("test_dataset")
# table = dataset.table("pt-ox-02")
rows = client.query_and_wait(query) 

print("done")
