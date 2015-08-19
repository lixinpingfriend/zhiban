insert into
    t_faq
(
    tuid
    ,show_name
    ,lable
    ,content
    ,tenantry_id
    ,superior_id
    ,is_node
    ,creator_id
    ,create_date
    ,start_date
    ,end_date
    ,remark
    ,time_stamp
    ,faq_type
    ,is_expired
    ,is_bulletin
)
values
(
    ${seq:nextval@seq_faq}
    ,${fld:show_name}
    ,${fld:lable}
    ,${fld:content}
    ,${def:tenantry}
    ,${fld:superior_id}
    ,${fld:is_node}
    ,'${def:user}'
    ,{ts '${def:timestamp}'}
    ,${fld:start_date}
    ,${fld:end_date}
    ,${fld:remark}
    ,{ts '${def:timestamp}'}
    ,'0'
    ,${fld:is_expired}
    ,${fld:is_bulletin}
)
