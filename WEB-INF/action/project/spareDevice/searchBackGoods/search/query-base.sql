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
  g.new_sign
from 
	pm_backup_goods g
where 1=1 ${filter}