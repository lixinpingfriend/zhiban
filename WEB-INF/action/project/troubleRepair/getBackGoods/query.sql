select d.*  from pm_backup_goods d
inner join pm_device_repair t
on d.tuid=t.backup__goods_id
where t.tuid=${fld:tuid}