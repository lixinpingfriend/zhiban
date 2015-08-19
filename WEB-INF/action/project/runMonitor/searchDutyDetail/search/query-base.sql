select 
  t.tuid,
  to_char(t.trouble_date,'HH24:Mi') created,
  wmsys.wm_concat(d.domain_id)  domainvalue,t.createby,r.remark
from 
 pm_device_run_trouble  t
 left join  pm_plan_record r on t.tuid=r.entity_id and r.event_type=2
left join  (select *  from  pm_device_run_detail where status=0 ) d on t.tuid = d.run_id
where 
  to_char(t.trouble_date,'yyyy-MM-dd') = ${fld:trouble_date}
group by to_char(t.trouble_date,'HH24:Mi'),t.tuid,t.createby,r.remark
order by created desc