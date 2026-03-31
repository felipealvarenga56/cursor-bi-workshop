select
    {{ dbt_utils.generate_surrogate_key(["customer_id"]) }} as customer_key,
    customer_id,
    email,
    country,
    customer_created_at
from {{ ref("stg_customers") }}
