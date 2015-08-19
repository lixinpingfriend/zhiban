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
  g.device_id,
  g.new_sign,
  d.name as device_name
from 
	pm_backup_goods g
left join pm_device d on g.device_id = d.tuid
where
	g.tuid = ${fld:id}
