select
    cast(customer_id as integer) as customer_id,
    cast(email as varchar) as email,
    cast(country as varchar) as country,
    cast(created_at as date) as customer_created_at
from {{ ref("raw_customers") }}
