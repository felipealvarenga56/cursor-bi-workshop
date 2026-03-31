select
    cast(product_id as integer) as product_id,
    cast(sku as varchar) as sku,
    cast(name as varchar) as product_name,
    cast(category as varchar) as category,
    cast(unit_price as decimal(18, 2)) as unit_price
from {{ ref("raw_products") }}
