select d.*,t.check_status,
t.repair_by,
t.telephone,
t.unit_name,
to_char(t.repaird,'yyyy-MM-dd') repaird
from pm_device d
inner join pm_device_repair t
on d.tuid=t.device_id
where t.tuid=${fld:tuid}