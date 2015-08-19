insert into pm_device_attchment
(
    tuid,
	attachment_type,
	device_id,
	name,
	file_size,
	content_type,
	file_path,
	createby,
	created
)
values
(
    ${seq:nextval@seq_pm_device_attchment},
    ${fld:paramid},
    ${fld:paramid1},
    ${fld:file.filename},
    ${fld:file_size},
    ${fld:file.content-type},
    ${fld:file.path},
    ${ses:userId},
    to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff')
)