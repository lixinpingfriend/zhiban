select 
  t.tuid,
  to_char(t.trouble_date,'HH24:Mi') created,
  to_char(t.trouble_date,'yyyy-MM-dd') trouble_date,
  wmsys.wm_concat(d.domain_id)  domainvalue,t.createby
from 
 pm_device_run_trouble  t
left join pm_device_run_detail d on t.tuid = d.run_id
where  d.status=0 and
t.tuid=${fld:tuid}
group by to_char(t.trouble_date,'HH24:Mi'),t.tuid,t.createby, to_char(t.trouble_date,'yyyy-MM-dd')