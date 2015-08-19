union
select
  s.campaign_id,
  s.scope_type as show_order,
  d.dealer_name_${def:locale} as scope_name
from 
  cs_campaign_scope s
  inner join cc_dealer d on s.scope_value = d.dealer_code
where 
  s.scope_type='5'  /*¾­ÏúÉÌ*/
  and(
	  (
	  	${fld:validate_date}='0'
	  and 
	  	(
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
  and exists 
  (select 1 from cc_dealer d where d.dealer_code=s.scope_value 
  and case when ${fld:dealer_name} is not null then d.dealer_name_${def:locale} else '1' end like  case when ${fld:dealer_name} is not null then concat('%',${fld:dealer_name},'%') else '0' end
  )
