insert into pm_document
(
    tuid,
    name,
    content_type,
    file_size,
    is_shared,
    created,
    createby,
    file_path,
    document_type_id,
    entity_id
)
values
(
    ${seq:nextval@seq_pm_document},
    ${fld:file.filename},
    ${fld:file.content-type},
    ${fld:file_size},
    0,
    to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),
    ${ses:userId},
    ${fld:file.path},
    ${fld:paramid},
     ${fld:paramid1}
)