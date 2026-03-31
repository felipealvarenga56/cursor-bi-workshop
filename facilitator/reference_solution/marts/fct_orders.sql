select
    o.order_line_id,
    o.order_id,
    o.order_date,
    o.quantity,
    o.line_amount,
    c.customer_key,
    p.product_key
from {{ ref("stg_orders") }} as o
left join {{ ref("dim_customer") }} as c on o.customer_id = c.customer_id
left join {{ ref("dim_product") }} as p on o.product_id = p.product_id
