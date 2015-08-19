union
select
  s.campaign_id,
  s.scope_type as show_order,
  d.domain_text_${def:locale} as scope_name
from 
  cs_campaign_scope s
  inner join t_domain d on s.scope_value = d.domain_value and d.namespace='IntenedeSeries'
where 
  ${fld:interested_series} is  not null
  and s.scope_type='7'  /*车系*/
  and s.scope_value=${fld:interested_series}  
  and(
  (
  ${fld:validate_date}='0'
  and (
  start_date::date > {d '${def:date}'} 
  or 
  end_date::date - 1 < {d '${def:date}'}
  )
  )
  or
  (
  ${fld:validate_date}='1'
  and s.start_date::date <= {d '${def:date}'} 
  and s.end_date::date - 1 >= {d '${def:date}'}
  )
  )