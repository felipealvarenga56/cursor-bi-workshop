select
    cast(order_line_id as integer) as order_line_id,
    cast(order_id as integer) as order_id,
    cast(customer_id as integer) as customer_id,
    cast(product_id as integer) as product_id,
    cast(order_date as date) as order_date,
    cast(quantity as integer) as quantity,
    cast(line_amount as decimal(18, 2)) as line_amount
from {{ ref("raw_orders") }}
