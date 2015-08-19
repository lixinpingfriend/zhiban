 union 
select
  s.campaign_id,
  s.scope_type as show_order,
  d.domain_text_${def:locale} as scope_name
from 
  cs_campaign_scope s
  inner join t_domain d on s.scope_value = d.domain_value and d.namespace='Area'
where 
  ${fld:area} is  not null 
  and s.scope_type='2'   /*大区*/
  and s.scope_value =  ${fld:area} 
  and s.start_date::date <= {d '${def:date}'} 
  and s.end_date::date - 1 >= {d '${def:date}'}
union
/*本区的经销商*/
select
  s.campaign_id,
  s.scope_type as show_order,
  d.dealer_name_${def:locale} as scope_name
from 
  cs_campaign_scope s
  inner join cc_dealer d on s.scope_value = d.dealer_code
where 
  ${fld:area}    is  not null  
  and ${fld:dealer} is null
  and s.scope_type='5'  /*经销商*/
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
  and exists (select 1 from cc_dealer d where d.dealer_code=s.scope_value and d.area=${fld:area}
  and case when ${fld:province} is not null then d.province else '1' end = case when ${fld:province} is not null then ${fld:province} else '1' end 
  and case when ${fld:city} is not null then d.city else '1' end = case when ${fld:city} is not null then ${fld:city} else '1' end 
  and case when ${fld:dealer_name} is not null then d.dealer_name_${def:locale} else '1' end like  case when ${fld:dealer_name} is not null then concat('%',${fld:dealer_name},'%') else '1' end
  )

