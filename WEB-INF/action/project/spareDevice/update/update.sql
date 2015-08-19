update 
	pm_backup_goods
set 
	name = ${fld:name},
	sn = ${fld:sn},
	pn = ${fld:pn},
	purchase_contract = ${fld:purchase_contract},
	transfer_record = ${fld:transfer_record},
	airport_sign = ${fld:airport_sign},
	maintain_sign = ${fld:maintain_sign},
	remark = ${fld:remark},
	device_id = ${fld:device_id},
	new_sign= ${fld:new_sign}
where
	tuid = ${fld:tuid}
