select 
  g.tuid,
  g.name,
  g.sn,
  g.pn,
  g.purchase_contract,
  g.transfer_record,
  g.airport_sign,
  g.maintain_sign,
  g.remark,
  d.name as device_name,
  (case g.new_sign when 0 then '调入'
  else '调出' end) as new_sign
from 
	pm_backup_goods g
left join pm_device d on g.device_id = d.tuid
where 1=1 
${filter}