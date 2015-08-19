select 
ta.campaign_id,
c.campaign_name 
from (
select 
distinct 
 campaign_id 
from  (
select
  campaign_id
from 
  cs_campaign_scope
where 
  scope_type='1' /*ȫ��*/
union
/*
select
  campaign_id
from 
  cs_campaign_scope
where 
  ${fld:dealer_code) is  not null 
  and scope_type='2'   --���� 
  and scope_value= (select area from cc_dealer d where d.dealer_code=${fld:dealer_code}  ) 
union
*/
select
  campaign_id
from 
  cs_campaign_scope
where 
  ${fld:cust_code} is  not null 
  and scope_type='3'  /*ʡ*/
  and scope_value= (select province from cc_customer cc where cc.cust_code=${fld:cust_code}  and cc.province is not null  )
union
select
  campaign_id
from 
  cs_campaign_scope
where 
  ${fld:cust_code} is  not null 
  and scope_type='4'  /*����*/
  and scope_value= (select city from cc_customer cc where cc.cust_code=${fld:cust_code}  and cc.city is not null   )
union
select
  campaign_id
from 
  cs_campaign_scope
where 
  ${fld:dealer_code} is  not null 
  and scope_type='5'  /*������*/
  and scope_value= ${fld:dealer_code}  
union
select
  campaign_id
from 
  cs_campaign_scope
where 
  ${fld:interested_brand} is  not null 
  and scope_type='6'  /*Ʒ��*/
  and scope_value=${fld:interested_brand}
union
select
  campaign_id
from 
  cs_campaign_scope
where 
  ${fld:interested_series} is  not null 
  and scope_type='6'  /*��ϵ*/
  and scope_value=${fld:interested_series}
)  as tt

) as ta 
inner join  cs_campaign c on  c.tuid= campaign_id  and c.campaign_type = '0' AND c.campaign_status = '1'

 
 





 
