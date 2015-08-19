insert into pm_device_callback
(
    tuid,
    entity_id,
    created,
    createdby,
    content
)
values
(
    ${seq:nextval@seq_pm_device_callback},
    ${fld:entity_id},
    to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),
    ${ses:userId},
    ${fld:content}
)