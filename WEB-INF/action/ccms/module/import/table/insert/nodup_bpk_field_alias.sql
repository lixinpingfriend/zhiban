select bpk_field_alias from t_import_table
where lower(bpk_field_alias) = lower(${fld:bpk_field_alias}) 
and imp_id = ${fld:imp_id}